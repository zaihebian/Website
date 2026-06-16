import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const SITE_SOURCE = "liqentech";
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
};

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

export async function insertLeadSubmission(submission: LeadSubmissionInput) {
  const { error } = await getSupabaseAdmin().from(LEAD_SUBMISSIONS_TABLE).insert(submission);
  if (error) throw error;
}

export async function getDashboardData() {
  const [eventsResult, leadsResult] = await Promise.all([
    getSupabaseAdmin()
      .from(BEHAVIOR_EVENTS_TABLE)
      .select("*")
      .order("id", { ascending: false })
      .limit(10000),
    getSupabaseAdmin()
      .from(LEAD_SUBMISSIONS_TABLE)
      .select("*")
      .order("id", { ascending: false })
      .limit(1000),
  ]);

  if (eventsResult.error) throw eventsResult.error;
  if (leadsResult.error) throw leadsResult.error;

  const events = (eventsResult.data ?? []) as BehaviorEventRow[];
  const leads = (leadsResult.data ?? []) as LeadSubmissionRow[];
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
