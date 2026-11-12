import { LEAD_STATUSES, type LeadStatus } from "@/lib/behaviorEvents";
import type { EventListFilters, LeadListFilters } from "@/lib/adminQueries";

export const ADMIN_WINDOWS = [7, 30, 90] as const;

type RawParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseDays(raw: string | undefined) {
  const days = Number(raw);
  return (ADMIN_WINDOWS as readonly number[]).includes(days) ? days : 30;
}

function parsePage(raw: string | undefined) {
  const page = Number(raw);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export function parseLeadFilters(params: RawParams): LeadListFilters {
  const rawStatus = firstValue(params.status);
  const status: LeadStatus | "all" = (LEAD_STATUSES as readonly string[]).includes(rawStatus ?? "")
    ? (rawStatus as LeadStatus)
    : "all";

  return {
    query: (firstValue(params.query) ?? "").trim().slice(0, 80),
    status,
    days: parseDays(firstValue(params.days)),
    page: parsePage(firstValue(params.page)),
    includeSynthetic: firstValue(params.synthetic) === "1",
  };
}

export function parseEventFilters(params: RawParams): EventListFilters {
  return {
    type: (firstValue(params.type) ?? "all").slice(0, 40) || "all",
    days: parseDays(firstValue(params.days)),
    page: parsePage(firstValue(params.page)),
  };
}

export function leadFilterQuery(filters: LeadListFilters, overrides: Partial<LeadListFilters> = {}) {
  const merged = { ...filters, ...overrides };
  const search = new URLSearchParams();
  if (merged.query) search.set("query", merged.query);
  if (merged.status !== "all") search.set("status", merged.status);
  if (merged.includeSynthetic) search.set("synthetic", "1");
  search.set("days", String(merged.days));
  if (merged.page > 1) search.set("page", String(merged.page));
  return search.toString();
}
