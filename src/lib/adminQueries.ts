import {
  BEHAVIOR_EVENTS_TABLE,
  getSupabaseAdmin,
  LEAD_SUBMISSIONS_TABLE,
  LEAD_STATUSES,
  type BehaviorEventRow,
  type LeadStatus,
  type LeadSubmissionRow,
} from "@/lib/behaviorEvents";

export const LEADS_PAGE_SIZE = 20;
export const EVENTS_PAGE_SIZE = 50;
export const EXPORT_LIMIT = 5000;

export type LeadListFilters = {
  query: string;
  status: LeadStatus | "all";
  days: number;
  page: number;
  /** Show rows flagged as synthetic (simulator / smoke tests). Hidden by default. */
  includeSynthetic: boolean;
};

export type EventListFilters = {
  type: string;
  days: number;
  page: number;
};

export type PageResult<T> = {
  rows: T[];
  total: number;
  page: number;
  pageCount: number;
};

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  won: "Won",
  lost: "Lost",
  spam: "Spam",
};

function sinceIso(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

/** PostgREST filters treat these characters specially; strip them from user input. */
function sanitizeSearchTerm(term: string) {
  return term.replace(/[%,()*\\"]/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);
}

export async function listLeads(filters: LeadListFilters): Promise<PageResult<LeadSubmissionRow>> {
  const page = Math.max(1, filters.page);
  const from = (page - 1) * LEADS_PAGE_SIZE;
  const to = from + LEADS_PAGE_SIZE - 1;

  let query = getSupabaseAdmin()
    .from(LEAD_SUBMISSIONS_TABLE)
    .select("*", { count: "exact" })
    .gte("created_at", sinceIso(filters.days))
    .order("id", { ascending: false })
    .range(from, to);

  if (filters.status !== "all") query = query.eq("status", filters.status);
  if (!filters.includeSynthetic) query = query.eq("synthetic", false);

  const term = sanitizeSearchTerm(filters.query);
  if (term) {
    query = query.or(`email.ilike.%${term}%,name.ilike.%${term}%,company.ilike.%${term}%`);
  }

  const { data, count, error } = await query;
  if (error) throw error;

  const total = count ?? data?.length ?? 0;
  return {
    rows: (data ?? []) as LeadSubmissionRow[],
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / LEADS_PAGE_SIZE)),
  };
}

export async function getLead(id: number): Promise<LeadSubmissionRow | null> {
  const { data, error } = await getSupabaseAdmin()
    .from(LEAD_SUBMISSIONS_TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return (data as LeadSubmissionRow | null) ?? null;
}

export async function getLeadEvents(lead: LeadSubmissionRow, limit = 50): Promise<BehaviorEventRow[]> {
  const kinds: string[] = [];
  if (lead.visitor_id) kinds.push(`visitor_id.eq.${lead.visitor_id}`);
  if (lead.session_id) kinds.push(`session_id.eq.${lead.session_id}`);
  if (!kinds.length) return [];

  const { data, error } = await getSupabaseAdmin()
    .from(BEHAVIOR_EVENTS_TABLE)
    .select("*")
    .or(kinds.join(","))
    .order("id", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as BehaviorEventRow[];
}

export async function getAdminSummary(days: number) {
  const supabase = getSupabaseAdmin();
  const since = sinceIso(days);

  const statusCounts = await Promise.all(
    LEAD_STATUSES.map(async (status) => {
      const { count, error } = await supabase
        .from(LEAD_SUBMISSIONS_TABLE)
        .select("id", { count: "exact", head: true })
        .gte("created_at", since)
        .eq("synthetic", false)
        .eq("status", status);
      if (error) throw error;
      return [status, count ?? 0] as const;
    }),
  );

  const [leadsTotal, eventsTotal, syntheticLeads] = await Promise.all([
    supabase
      .from(LEAD_SUBMISSIONS_TABLE)
      .select("id", { count: "exact", head: true })
      .gte("created_at", since)
      .eq("synthetic", false),
    supabase
      .from(BEHAVIOR_EVENTS_TABLE)
      .select("id", { count: "exact", head: true })
      .gte("created_at", since),
    supabase
      .from(LEAD_SUBMISSIONS_TABLE)
      .select("id", { count: "exact", head: true })
      .gte("created_at", since)
      .eq("synthetic", true),
  ]);

  if (leadsTotal.error) throw leadsTotal.error;
  if (eventsTotal.error) throw eventsTotal.error;
  if (syntheticLeads.error) throw syntheticLeads.error;

  const byStatus = Object.fromEntries(statusCounts) as Record<LeadStatus, number>;
  return {
    days,
    leads: leadsTotal.count ?? 0,
    events: eventsTotal.count ?? 0,
    syntheticLeads: syntheticLeads.count ?? 0,
    openLeads: (byStatus.new ?? 0) + (byStatus.contacted ?? 0) + (byStatus.qualified ?? 0),
    byStatus,
  };
}

export async function listEvents(filters: EventListFilters): Promise<PageResult<BehaviorEventRow>> {
  const page = Math.max(1, filters.page);
  const from = (page - 1) * EVENTS_PAGE_SIZE;
  const to = from + EVENTS_PAGE_SIZE - 1;

  let query = getSupabaseAdmin()
    .from(BEHAVIOR_EVENTS_TABLE)
    .select("*", { count: "exact" })
    .gte("created_at", sinceIso(filters.days))
    .order("id", { ascending: false })
    .range(from, to);

  if (filters.type !== "all") query = query.eq("type", filters.type);

  const { data, count, error } = await query;
  if (error) throw error;

  const total = count ?? data?.length ?? 0;
  return {
    rows: (data ?? []) as BehaviorEventRow[],
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / EVENTS_PAGE_SIZE)),
  };
}

export async function updateLead(id: number, patch: { status: LeadStatus; notes: string | null }) {
  const { error } = await getSupabaseAdmin()
    .from(LEAD_SUBMISSIONS_TABLE)
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

/**
 * Erasure: removes the lead row and the behaviour rows we hold for the same
 * visitor/session. Returns how many event rows were removed.
 */
export async function deleteLeadAndEvents(lead: LeadSubmissionRow) {
  const supabase = getSupabaseAdmin();
  let deletedEvents = 0;

  if (lead.visitor_id) {
    const { error, count } = await supabase
      .from(BEHAVIOR_EVENTS_TABLE)
      .delete({ count: "exact" })
      .eq("visitor_id", lead.visitor_id);
    if (error) throw error;
    deletedEvents += count ?? 0;
  }

  if (lead.session_id) {
    const { error, count } = await supabase
      .from(BEHAVIOR_EVENTS_TABLE)
      .delete({ count: "exact" })
      .eq("session_id", lead.session_id);
    if (error) throw error;
    deletedEvents += count ?? 0;
  }

  const { error } = await supabase.from(LEAD_SUBMISSIONS_TABLE).delete().eq("id", lead.id);
  if (error) throw error;

  return { deletedEvents };
}

function csvCell(value: unknown) {
  if (value === null || value === undefined) return "";
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export async function exportLeadsCsv(filters: LeadListFilters) {
  let query = getSupabaseAdmin()
    .from(LEAD_SUBMISSIONS_TABLE)
    .select("*")
    .gte("created_at", sinceIso(filters.days))
    .order("id", { ascending: false })
    .limit(EXPORT_LIMIT);

  if (filters.status !== "all") query = query.eq("status", filters.status);
  if (!filters.includeSynthetic) query = query.eq("synthetic", false);

  const term = sanitizeSearchTerm(filters.query);
  if (term) query = query.or(`email.ilike.%${term}%,name.ilike.%${term}%,company.ilike.%${term}%`);

  const { data, error } = await query;
  if (error) throw error;

  const rows = (data ?? []) as LeadSubmissionRow[];
  const header = [
    "id",
    "created_at",
    "status",
    "synthetic",
    "name",
    "email",
    "company",
    "query",
    "page_path",
    "utm_source",
    "utm_campaign",
    "max_scroll_depth",
    "mautic_sync_status",
    "mautic_contact_id",
    "mautic_points",
    "mautic_tags",
    "notes",
  ];
  const lines = [header.join(",")];

  rows.forEach((row) => {
    lines.push(
      [
        row.id,
        row.created_at,
        row.status ?? "new",
        row.synthetic ? "yes" : "no",
        row.name,
        row.email,
        row.company,
        row.query,
        row.page_path,
        row.utm_source,
        row.utm_campaign,
        row.max_scroll_depth,
        row.mautic_sync_status ?? "pending",
        row.mautic_contact_id,
        row.mautic_points,
        Array.isArray(row.mautic_tags) ? row.mautic_tags.join(" ") : "",
        row.notes,
      ]
        .map(csvCell)
        .join(","),
    );
  });

  return lines.join("\r\n");
}
