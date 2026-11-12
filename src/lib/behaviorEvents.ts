import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SITE_SOURCE } from "@/lib/site";

export { SITE_SOURCE };
export const BEHAVIOR_EVENTS_TABLE = "liqentech_behavior_events";
export const LEAD_SUBMISSIONS_TABLE = "liqentech_lead_submissions";

export type UtmParams = {
  source?: string | null;
  medium?: string | null;
  campaign?: string | null;
  term?: string | null;
  content?: string | null;
};

export type BehaviorEventInput = {
  site_source: string;
  type: string;
  visitor_id?: string | null;
  session_id?: string | null;
  page_url?: string | null;
  page_path?: string | null;
  referrer?: string | null;
  section?: string | null;
  target?: string | null;
  value?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  metadata_json?: Record<string, unknown> | null;
  user_agent?: string | null;
  ip_hint?: string | null;
};

export type BehaviorEventRow = BehaviorEventInput & {
  id: number;
  created_at: string;
};

export type LeadSubmissionInput = {
  site_source: string;
  visitor_id?: string | null;
  session_id?: string | null;
  name?: string | null;
  email: string;
  company?: string | null;
  query?: string | null;
  page_url?: string | null;
  page_path?: string | null;
  referrer?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  max_scroll_depth?: number | null;
  clicked_targets?: string[] | null;
  viewed_sections?: string[] | null;
  user_agent?: string | null;
  ip_hint?: string | null;
  // Admin / Mautic maintenance fields (see supabase-liqentech-admin.sql).
  status?: LeadStatus;
  notes?: string | null;
  updated_at?: string | null;
  mautic_contact_id?: string | null;
  mautic_sync_status?: MauticSyncStatus;
  mautic_tags?: string[] | null;
  mautic_points?: number | null;
  synthetic?: boolean;
};

export const LEAD_STATUSES = ["new", "contacted", "qualified", "won", "lost", "spam"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const MAUTIC_SYNC_STATUSES = ["pending", "synced", "failed", "skipped"] as const;
export type MauticSyncStatus = (typeof MAUTIC_SYNC_STATUSES)[number];

export type LeadSubmissionRow = LeadSubmissionInput & {
  id: number;
  created_at: string;
};

export type CountRow = {
  label: string;
  count: number;
};

let supabase: SupabaseClient | null = null;

export function isBehaviorDbConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function getSupabaseAdmin() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  if (!supabase) {
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return supabase;
}

export function textValue(value: unknown) {
  if (value === undefined || value === null) return null;
  return String(value).slice(0, 500);
}

export function longTextValue(value: unknown) {
  if (value === undefined || value === null) return null;
  return String(value).slice(0, 5000);
}

export async function insertBehaviorEvent(event: BehaviorEventInput) {
  const { error } = await getSupabaseAdmin().from(BEHAVIOR_EVENTS_TABLE).insert(event);
  if (error) throw error;
}

/**
 * Inserts a lead and returns its id (the admin UI links to /admin/leads/<id> and
 * records the Mautic outcome on the same row).
 */
export async function insertLeadSubmission(submission: LeadSubmissionInput) {
  const { data, error } = await getSupabaseAdmin()
    .from(LEAD_SUBMISSIONS_TABLE)
    .insert(submission)
    .select("id")
    .single();
  if (error) throw error;
  const inserted = data as { id?: number } | null;
  return inserted?.id ?? null;
}

export async function updateLeadMauticSync(
  id: number,
  patch: {
    mautic_contact_id?: string | null;
    mautic_sync_status: MauticSyncStatus;
  },
) {
  const { error } = await getSupabaseAdmin()
    .from(LEAD_SUBMISSIONS_TABLE)
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

/**
 * Duplicate guard: a lead row for the same email inside the window means the
 * visitor retried a submission that already landed (double click, refresh, or a
 * retry after the client timed out). Re-inserting would duplicate the row and
 * award Mautic points twice.
 */
export async function hasRecentLeadSubmission(email: string, withinMinutes = 10) {
  const since = new Date(Date.now() - withinMinutes * 60_000).toISOString();
  const { data, error } = await getSupabaseAdmin()
    .from(LEAD_SUBMISSIONS_TABLE)
    .select("id")
    .eq("email", email)
    .gte("created_at", since)
    .limit(1);

  if (error) throw error;
  return (data?.length ?? 0) > 0;
}

export const DASHBOARD_WINDOWS = [7, 30, 90] as const;

/**
 * Reads the dashboard rows for a time window.
 *
 * Note: Supabase's PostgREST `Max Rows` setting (Project Settings → API, 1000 by
 * default) silently caps a response, so `limit()` is a client-side wish, not a
 * guarantee. Keep the window narrow and the limits explicit, and raise
 * `Max Rows` (or move the aggregation into an RPC) before trusting the totals.
 */
export async function getDashboardData(days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const [eventsResult, leadsResult] = await Promise.all([
    getSupabaseAdmin()
      .from(BEHAVIOR_EVENTS_TABLE)
      .select("*")
      .gte("created_at", since)
      .order("id", { ascending: false })
      .limit(5000),
    getSupabaseAdmin()
      .from(LEAD_SUBMISSIONS_TABLE)
      .select("*")
      .gte("created_at", since)
      .order("id", { ascending: false })
      .limit(500),
  ]);

  if (eventsResult.error) throw eventsResult.error;
  if (leadsResult.error) throw leadsResult.error;

  const rawEvents = (eventsResult.data ?? []) as BehaviorEventRow[];
  const rawLeads = (leadsResult.data ?? []) as LeadSubmissionRow[];

  // Synthetic traffic from scripts/simulate-visitors.mjs is marked by the server;
  // keep it out of the dashboard so rehearsals do not look like real demand.
  const isSynthetic = (row: { metadata_json?: Record<string, unknown> | null }) => row.metadata_json?.synthetic === true;
  const syntheticVisitors = new Set(rawEvents.filter(isSynthetic).map((event) => event.visitor_id).filter(Boolean));
  const events = rawEvents.filter((event) => !isSynthetic(event));
  const leads = rawLeads.filter((lead) => !lead.visitor_id || !syntheticVisitors.has(lead.visitor_id));
  const syntheticHidden = rawEvents.length - events.length + (rawLeads.length - leads.length);

  const visitors = new Set(events.map((event) => event.visitor_id).filter(Boolean));
  const sessions = new Set(events.map((event) => event.session_id).filter(Boolean));
  const leadVisitors = new Set(leads.map((lead) => lead.visitor_id).filter(Boolean));
  const highIntentClicks = events.filter(
    (event) =>
      event.type === "click" &&
      (event.target?.includes("consultation") || event.target?.includes("contact") || event.target?.includes("email")),
  );

  return {
    events,
    leads,
    windowDays: days,
    syntheticHidden,
    totals: {
      events: events.length,
      visitors: visitors.size,
      sessions: sessions.size,
      leads: leads.length,
      leadVisitors: leadVisitors.size,
      conversionRate: visitors.size ? (leads.length / visitors.size) * 100 : 0,
      highIntentClicks: highIntentClicks.length,
      averageScrollDepth: average(
        events
          .filter((event) => event.type === "scroll_depth")
          .map((event) => Number(event.value))
          .filter(Number.isFinite),
      ),
    },
    eventTypes: countBy(events, (event) => event.type),
    sourceBreakdown: countBy(events, (event) => event.utm_source || sourceFromReferrer(event.referrer) || "direct"),
    campaignBreakdown: countBy(events, (event) => event.utm_campaign || "none"),
    pageBreakdown: countBy(events, (event) => event.page_path || "/"),
    sectionViews: countBy(
      events.filter((event) => event.type === "section_view"),
      (event) => event.section || "unknown",
    ),
    clicks: countBy(
      events.filter((event) => event.type === "click"),
      (event) => event.target || "unknown",
    ),
    scrollDepth: countBy(
      events.filter((event) => event.type === "scroll_depth"),
      (event) => event.value || "unknown",
      true,
    ),
    leadSources: countBy(leads, (lead) => lead.utm_source || sourceFromReferrer(lead.referrer) || "direct"),
    leadCompanies: countBy(leads, (lead) => lead.company || "unknown"),
    dailyEvents: countByDate(events),
    dailyLeads: countByDate(leads),
    recentEvents: events.slice(0, 80),
    recentLeads: leads.slice(0, 40),
  };
}

function countBy<T>(rows: T[], getLabel: (row: T) => string, numeric = false): CountRow[] {
  const counts = new Map<string, number>();
  rows.forEach((row) => {
    const label = getLabel(row);
    counts.set(label, (counts.get(label) ?? 0) + 1);
  });

  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => {
      if (numeric) return Number(a.label) - Number(b.label);
      return b.count - a.count;
    });
}

function countByDate(rows: Array<{ created_at: string }>) {
  return countBy(rows, (row) => new Date(row.created_at).toISOString().slice(0, 10)).slice(0, 14).reverse();
}

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function sourceFromReferrer(referrer?: string | null) {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    if (host.includes("google")) return "google";
    if (host.includes("bing")) return "bing";
    if (host.includes("linkedin")) return "linkedin";
    if (host.includes("x.com") || host.includes("twitter")) return "social";
    return host;
  } catch {
    return null;
  }
}
