import { NextRequest, NextResponse } from "next/server";
import {
  hasRecentLeadSubmission,
  insertBehaviorEvent,
  insertLeadSubmission,
  isBehaviorDbConfigured,
  longTextValue,
  SITE_SOURCE,
  textValue,
  updateLeadMauticSync,
} from "@/lib/behaviorEvents";
import { isSameOrigin, maskIp, sanitizeMetadata } from "@/lib/eventPayload";
import { buildTags, calculatePoints } from "@/lib/leadScore";
import { isMauticApiConfigured, updateTrackedMauticContact } from "@/lib/mautic";
import { rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// A tracking payload is a few hundred bytes. Anything larger is abuse or a bug.
const MAX_BODY_BYTES = 8192;
const GENERAL_RATE_LIMIT = {
  limit: Number(process.env.BEHAVIOR_RATE_LIMIT ?? 120),
  windowMs: 60_000,
};
const LEAD_RATE_LIMIT = {
  limit: Number(process.env.BEHAVIOR_LEAD_RATE_LIMIT ?? 30),
  windowMs: 60 * 60_000,
};

type BehaviorEvent = {
  type?: string;
  visitorId?: string;
  sessionId?: string;
  pageUrl?: string;
  pagePath?: string;
  referrer?: string;
  mauticContactId?: string;
  mauticDeviceId?: string;
  section?: string;
  target?: string;
  value?: string | number | boolean;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
  metadata?: Record<string, unknown>;
  contact?: {
    email?: string;
    name?: string;
    company?: string;
    query?: string;
  };
};

type SinkStatus = {
  behaviorEvent: boolean;
  leadSubmission: boolean;
  mautic: boolean;
};

let warnedMissingDatabase = false;

function rejection(status: number, error: string, retryAfterSeconds?: number) {
  return NextResponse.json(
    { ok: false, error },
    {
      status,
      headers: retryAfterSeconds ? { "retry-after": String(retryAfterSeconds) } : undefined,
    },
  );
}

/**
 * Runs a single storage backend in isolation.
 *
 * Supabase (behavior row / lead row) and Mautic (contact, tags, points) are
 * independent sinks: a missing or failing backend must never prevent the
 * others from running, because a lead captured in Mautic is still a captured
 * lead even when the Postgres side is unavailable.
 */
async function attemptSink(label: string, run: () => Promise<unknown>) {
  try {
    await run();
    return true;
  } catch (error) {
    console.error(`[behavior-events] ${label} failed`, error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return rejection(413, "Payload too large");
  }

  const rawBody = await request.text();
  if (rawBody.length > MAX_BODY_BYTES) {
    return rejection(413, "Payload too large");
  }

  let body: BehaviorEvent | null = null;
  try {
    body = (JSON.parse(rawBody) as BehaviorEvent) ?? null;
  } catch {
    body = null;
  }

  if (!body?.type) {
    return NextResponse.json({ error: "type is required" }, { status: 400 });
  }

  const originAllowed = isSameOrigin(request.headers.get("origin"), [
    request.headers.get("host"),
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim(),
    request.nextUrl.host,
  ]);
  if (!originAllowed) {
    return rejection(403, "Origin is not allowed");
  }

  const rawIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? null;
  const userAgent = request.headers.get("user-agent");
  const ipHint = maskIp(rawIp);
  const rateKey = rawIp ?? "unknown";

  const generalQuota = rateLimit(`general:${rateKey}`, GENERAL_RATE_LIMIT.limit, GENERAL_RATE_LIMIT.windowMs);
  if (!generalQuota.allowed) {
    return rejection(429, "Too many events", generalQuota.retryAfterSeconds);
  }

  const supabaseReady = isBehaviorDbConfigured();
  const mauticReady = isMauticApiConfigured();

  const leadEmail = textValue(body.contact?.email);

  // Honeypot: a real visitor never fills the hidden company_website field.
  if (String(body.metadata?.honeypot ?? "").trim()) {
    console.warn("[behavior-events] honeypot triggered, dropping payload");
    return NextResponse.json({ ok: true, stored: false, leadCaptured: false, honeypot: true });
  }

  if (!supabaseReady && !warnedMissingDatabase) {
    warnedMissingDatabase = true;
    console.warn(
      "[behavior-events] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 未配置：行为事件不入库，仅 Mautic 同步可用",
    );
  }

  const isLead = body.type === "form_submit" && Boolean(leadEmail);
  const synthetic = Boolean(request.headers.get("x-synthetic-visitor")) || body.metadata?.synthetic === true;
  const metadata = sanitizeMetadata(body.metadata, synthetic);
  const clickedTargets = Array.isArray(metadata.clickedTargets) ? (metadata.clickedTargets as string[]) : [];
  const viewedSections = Array.isArray(metadata.viewedSections) ? (metadata.viewedSections as string[]) : [];
  const maxScrollDepth = Number(metadata.maxScrollDepth ?? 0);

  if (isLead) {
    const leadQuota = rateLimit(`lead:${rateKey}`, LEAD_RATE_LIMIT.limit, LEAD_RATE_LIMIT.windowMs);
    if (!leadQuota.allowed) {
      console.warn("[behavior-events] lead rate limit hit", { ip: rateKey });
      return rejection(429, "Too many submissions", leadQuota.retryAfterSeconds);
    }
  }

  // Idempotency: a retry of a submission that already landed must not create a
  // second lead row nor award Mautic points again.
  let duplicate = false;
  if (isLead && leadEmail && supabaseReady) {
    try {
      duplicate = await hasRecentLeadSubmission(leadEmail);
    } catch (error) {
      // A failed dedupe check must not block the lead from being stored.
      console.error("[behavior-events] duplicate check failed", error);
    }
  }

  let behaviorEventTask: Promise<boolean> = Promise.resolve(false);
  let leadSubmissionTask: Promise<boolean> = Promise.resolve(false);
  let mauticTask: Promise<boolean> = Promise.resolve(false);
  // The admin backend shows the Mautic snapshot, so remember what was actually
  // attempted (the row id and the contact id returned by Mautic).
  let leadRowId: number | null = null;
  let mauticContactId: string | null = null;
  const leadSummary = {
    maxScrollDepth,
    clickedTargets,
    viewedSections,
    hasMessage: Boolean(textValue(body.contact?.query)),
  };

  // Sink 1: the raw behavior event row (analytics only, best effort).
  if (supabaseReady) {
    behaviorEventTask = attemptSink("behavior event insert", () =>
      insertBehaviorEvent({
        site_source: SITE_SOURCE,
        type: textValue(body.type) ?? "unknown",
        visitor_id: textValue(body.visitorId),
        session_id: textValue(body.sessionId),
        page_url: textValue(body.pageUrl),
        page_path: textValue(body.pagePath),
        referrer: textValue(body.referrer),
        section: textValue(body.section),
        target: textValue(body.target),
        value: textValue(body.value),
        utm_source: textValue(body.utm?.source),
        utm_medium: textValue(body.utm?.medium),
        utm_campaign: textValue(body.utm?.campaign),
        utm_term: textValue(body.utm?.term),
        utm_content: textValue(body.utm?.content),
        metadata_json: {
          ...metadata,
          mauticContactId: textValue(body.mauticContactId),
          mauticDeviceId: textValue(body.mauticDeviceId),
        },
        user_agent: userAgent,
        ip_hint: ipHint,
      }),
    );
  }

  // Sinks 2 + 3: the lead itself. Both run when configured, independently of
  // each other and of the behavior-event row above — unless the submission is a
  // duplicate of one that is already stored.
  if (body.type === "form_submit" && leadEmail && !duplicate) {
    if (supabaseReady) {
      leadSubmissionTask = attemptSink("lead submission insert", async () => {
        leadRowId = await insertLeadSubmission({
          site_source: SITE_SOURCE,
          visitor_id: textValue(body.visitorId),
          session_id: textValue(body.sessionId),
          name: textValue(body.contact?.name),
          email: leadEmail,
          company: textValue(body.contact?.company),
          query: longTextValue(body.contact?.query),
          page_url: textValue(body.pageUrl),
          page_path: textValue(body.pagePath),
          referrer: textValue(body.referrer),
          utm_source: textValue(body.utm?.source),
          utm_medium: textValue(body.utm?.medium),
          utm_campaign: textValue(body.utm?.campaign),
          utm_term: textValue(body.utm?.term),
          utm_content: textValue(body.utm?.content),
          max_scroll_depth: maxScrollDepth,
          clicked_targets: clickedTargets,
          viewed_sections: viewedSections,
          user_agent: userAgent,
          ip_hint: ipHint,
          status: "new",
          mautic_sync_status: mauticReady ? "pending" : "skipped",
          mautic_tags: buildTags(leadSummary),
          mautic_points: calculatePoints(leadSummary),
          synthetic,
        });
      });
    }

    if (mauticReady) {
      mauticTask = attemptSink("mautic contact sync", async () => {
        const contactId = await updateTrackedMauticContact(
          textValue(body.mauticContactId),
          {
            email: leadEmail,
            name: body.contact?.name,
            company: body.contact?.company,
          },
          leadSummary,
        );
        if (!contactId) throw new Error("Mautic did not return a contact id");
        mauticContactId = String(contactId);
      });
    }
  }

  const [behaviorEvent, leadSubmission, mautic] = await Promise.all([
    behaviorEventTask,
    leadSubmissionTask,
    mauticTask,
  ]);

  // Record the Mautic outcome on the lead row (best effort: the visitor's result
  // must not depend on this bookkeeping write).
  if (leadRowId && mauticReady) {
    try {
      await updateLeadMauticSync(leadRowId, {
        mautic_contact_id: mauticContactId,
        mautic_sync_status: mautic ? "synced" : "failed",
      });
    } catch (error) {
      console.error("[behavior-events] failed to record the Mautic sync outcome", error);
    }
  }

  const sinks: SinkStatus = { behaviorEvent, leadSubmission, mautic };
  const leadCaptured = leadSubmission || mautic || duplicate;

  // A lead submission that reached no sink at all must not pretend to be a
  // success: the modal relies on this status to avoid sending visitors to
  // /success while their enquiry was silently dropped.
  if (isLead && !leadCaptured) {
    console.error("[behavior-events] lead dropped: no sink accepted the submission", {
      supabaseConfigured: supabaseReady,
      mauticConfigured: mauticReady,
      sinks,
    });
    return NextResponse.json(
      {
        ok: false,
        stored: behaviorEvent,
        leadCaptured: false,
        duplicate: false,
        error: "Lead could not be stored",
        sinks,
        supabaseConfigured: supabaseReady,
        mauticConfigured: mauticReady,
      },
      { status: 503 },
    );
  }

  if (duplicate) {
    console.log("[behavior-events] duplicate lead submission ignored (already stored)");
  }

  if (isLead && mautic && !leadSubmission) {
    console.warn("[behavior-events] lead stored in Mautic only (Supabase 不可用或写入失败)", {
      supabaseConfigured: supabaseReady,
    });
  }

  return NextResponse.json({
    ok: true,
    stored: behaviorEvent || leadSubmission || duplicate,
    leadCaptured,
    duplicate,
    sinks,
    supabaseConfigured: supabaseReady,
    mauticConfigured: mauticReady,
  });
}
