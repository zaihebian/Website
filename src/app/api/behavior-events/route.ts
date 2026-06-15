import { NextRequest, NextResponse } from "next/server";
import {
  insertBehaviorEvent,
  insertLeadSubmission,
  isBehaviorDbConfigured,
  longTextValue,
  SITE_SOURCE,
  textValue,
} from "@/lib/behaviorEvents";
import { updateTrackedMauticContact } from "@/lib/mautic";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as BehaviorEvent | null;
  if (!body?.type) {
    return NextResponse.json({ error: "type is required" }, { status: 400 });
  }

  if (!isBehaviorDbConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  }

  const ipHint = request.headers.get("x-forwarded-for")?.split(",")[0] ?? null;
  const userAgent = request.headers.get("user-agent");

  await insertBehaviorEvent({
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
      ...(body.metadata ?? {}),
      mauticContactId: textValue(body.mauticContactId),
      mauticDeviceId: textValue(body.mauticDeviceId),
    },
    user_agent: userAgent,
    ip_hint: ipHint,
  });

  if (body.type === "form_submit" && body.contact?.email) {
    const clickedTargets = Array.isArray(body.metadata?.clickedTargets) ? body.metadata.clickedTargets.map(String) : [];
    const viewedSections = Array.isArray(body.metadata?.viewedSections) ? body.metadata.viewedSections.map(String) : [];
    const maxScrollDepth = Number(body.metadata?.maxScrollDepth ?? 0);

    await insertLeadSubmission({
      site_source: SITE_SOURCE,
      visitor_id: textValue(body.visitorId),
      session_id: textValue(body.sessionId),
      name: textValue(body.contact.name),
      email: textValue(body.contact.email) ?? "",
      company: textValue(body.contact.company),
      query: longTextValue(body.contact.query),
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
    });

    await updateTrackedMauticContact(textValue(body.mauticContactId), {
      email: body.contact.email,
      name: body.contact.name,
      company: body.contact.company,
    }).catch((error) => {
      console.error("Failed to update tracked Mautic contact", error);
    });
  }

  return NextResponse.json({ ok: true });
}
