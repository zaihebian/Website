import Link from "next/link";
import { ADMIN_WINDOWS, leadFilterQuery, parseLeadFilters } from "@/app/admin/filters";
import {
  AdminNotice,
  Card,
  Metric,
  Pager,
  StatusPill,
  SyncPill,
  formatDateTime,
} from "@/app/admin/ui";
import { LEAD_STATUS_LABELS, getAdminSummary, listLeads } from "@/lib/adminQueries";
import { LEAD_STATUSES, isBehaviorDbConfigured, type LeadSubmissionRow } from "@/lib/behaviorEvents";

export const dynamic = "force-dynamic";

type AdminPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  if (!isBehaviorDbConfigured()) {
    return (
      <AdminNotice title="Supabase is not configured">
        Set <code>SUPABASE_URL</code> and <code>SUPABASE_SERVICE_ROLE_KEY</code>, run
        {" "}<code>supabase-liqentech-behavior-events.sql</code> and{" "}
        <code>supabase-liqentech-admin.sql</code>, then reload. Until then the admin backend has nothing to read.
      </AdminNotice>
    );
  }

  const params = await searchParams;
  const filters = parseLeadFilters(params);
  const [summary, leads] = await Promise.all([getAdminSummary(filters.days), listLeads(filters)]);
  const rawDeleted = Array.isArray(params.deleted) ? params.deleted[0] : params.deleted;
  const deletedId = Number(rawDeleted);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Leads</h1>
          <p className="mt-1 text-sm text-[var(--ink-dim)]">
            Consultation submissions and the Mautic sync snapshot, for the last {filters.days} days.
          </p>
        </div>
        <form action="/admin" method="get" className="flex flex-wrap items-end gap-2">
          <label className="text-xs text-[var(--ink-faint)]">
            Search
            <input
              type="search"
              name="query"
              defaultValue={filters.query}
              placeholder="email, name, company"
              className="field mt-1 h-10 w-56 py-2"
            />
          </label>
          <label className="text-xs text-[var(--ink-faint)]">
            Status
            <select name="status" defaultValue={filters.status} className="field mt-1 h-10 w-40 py-2 !pr-12">
              <option value="all">All</option>
              {LEAD_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {LEAD_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs text-[var(--ink-faint)]">
            Window
            <select name="days" defaultValue={String(filters.days)} className="field mt-1 h-10 w-40 py-2 !pr-12">
              {ADMIN_WINDOWS.map((days) => (
                <option key={days} value={days}>
                  {days} days
                </option>
              ))}
            </select>
          </label>
          <label className="flex h-10 items-center gap-2 text-xs text-[var(--ink-faint)]">
            <input
              type="checkbox"
              name="synthetic"
              value="1"
              defaultChecked={filters.includeSynthetic}
              className="h-4 w-4 accent-[var(--accent)]"
            />
            Include test data
          </label>
          <button type="submit" className="btn-primary h-10 !px-5 !py-0 text-sm">
            Apply
          </button>
        </form>
      </div>

      {Number.isInteger(deletedId) && deletedId > 0 ? (
        <p className="rounded-2xl border border-[rgba(38,140,80,0.25)] bg-[rgba(38,140,80,0.08)] px-4 py-3 text-sm">
          Lead #{deletedId} and its behaviour rows were deleted.
        </p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Leads" value={summary.leads} hint={`${summary.events} events in window`} />
        <Metric label="Open" value={summary.openLeads} hint="new + contacted + qualified" />
        <Metric label="New" value={summary.byStatus.new ?? 0} hint="not touched yet" />
        <Metric label="Won" value={summary.byStatus.won ?? 0} hint={`lost ${summary.byStatus.lost ?? 0}`} />
      </div>

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[52rem] text-left text-sm">
            <thead className="border-b border-[var(--line)] text-[11px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Received</th>
                <th className="px-4 py-3">Lead</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Mautic</th>
                <th className="px-4 py-3">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {leads.rows.map((lead: LeadSubmissionRow) => (
                <tr key={lead.id} className="align-top hover:bg-white/60">
                  <td className="px-4 py-3 text-[var(--ink-faint)]">{lead.id}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-[var(--ink-dim)]">{formatDateTime(lead.created_at)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/leads/${lead.id}`} className="font-medium text-[var(--ink)] hover:underline">
                      {lead.name || "Unknown"}
                    </Link>
                    {lead.synthetic ? (
                      <span className="ml-2 rounded-full bg-[rgba(180,120,20,0.14)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#8a5a00]">
                        TEST
                      </span>
                    ) : null}
                    <div className="text-xs text-[var(--ink-faint)]">{lead.email}</div>
                  </td>
                  <td className="px-4 py-3 text-[var(--ink-dim)]">{lead.company || "-"}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={lead.status} />
                  </td>
                  <td className="px-4 py-3">
                    <SyncPill status={lead.mautic_sync_status} />
                  </td>
                  <td className="max-w-[18rem] px-4 py-3 text-[var(--ink-dim)]">
                    <span className="line-clamp-2">{lead.query || "-"}</span>
                  </td>
                </tr>
              ))}
              {leads.rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-[var(--ink-faint)]">
                    No leads match these filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>

      <Pager
        page={leads.page}
        pageCount={leads.pageCount}
        hrefFor={(page) => `/admin?${leadFilterQuery(filters, { page })}`}
      />
      <p className="text-xs text-[var(--ink-faint)]">
        {leads.total} lead(s) match · window {filters.days}d · export available at{" "}
        <Link href={`/admin/export?${leadFilterQuery(filters)}`} className="underline underline-offset-2">
          /admin/export
        </Link>
        {!filters.includeSynthetic && summary.syntheticLeads > 0 ? (
          <>
            {" "}
            · {summary.syntheticLeads} synthetic row(s) hidden —{" "}
            <Link
              href={`/admin?${leadFilterQuery(filters, { includeSynthetic: true, page: 1 })}`}
              className="underline underline-offset-2"
            >
              show them
            </Link>
          </>
        ) : null}
      </p>
    </div>
  );
}
