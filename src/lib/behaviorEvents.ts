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
