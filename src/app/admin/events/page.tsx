import { ADMIN_WINDOWS, parseEventFilters } from "@/app/admin/filters";
import { AdminNotice, Card, Pager, formatDateTime } from "@/app/admin/ui";
import { listEvents } from "@/lib/adminQueries";
import { isBehaviorDbConfigured } from "@/lib/behaviorEvents";

export const dynamic = "force-dynamic";

const EVENT_TYPES = [
  "all",
  "page_view",
  "section_view",
  "scroll_depth",
  "click",
  "form_start",
  "form_submit",
  "time_on_page",
];

type EventsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function EventsPage({ searchParams }: EventsPageProps) {
  if (!isBehaviorDbConfigured()) {
    return (
      <AdminNotice title="Supabase is not configured">
        The admin backend cannot read events until Supabase credentials and the SQL migrations are in place.
      </AdminNotice>
    );
  }

  const filters = parseEventFilters(await searchParams);
  const events = await listEvents(filters);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Events</h1>
          <p className="mt-1 text-sm text-[var(--ink-dim)]">
            Raw behaviour stream for the last {filters.days} days · {events.total} row(s).
          </p>
        </div>
        <form action="/admin/events" method="get" className="flex flex-wrap items-end gap-2">
          <label className="text-xs text-[var(--ink-faint)]">
            Type
            <select name="type" defaultValue={filters.type} className="field mt-1 h-10 w-44 py-2">
              {EVENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
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
          <button type="submit" className="btn-primary h-10 !px-5 !py-0 text-sm">
            Apply
          </button>
        </form>
      </div>

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[56rem] text-left text-sm">
            <thead className="border-b border-[var(--line)] text-[11px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Path</th>
                <th className="px-4 py-3">Target / section</th>
                <th className="px-4 py-3">Visitor</th>
                <th className="px-4 py-3">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {events.rows.map((event) => (
                <tr key={event.id} className="hover:bg-white/60">
                  <td className="px-4 py-2.5 text-[var(--ink-faint)]">{event.id}</td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-[var(--ink-dim)]">
                    {formatDateTime(event.created_at)}
                  </td>
                  <td className="px-4 py-2.5 font-medium">{event.type}</td>
                  <td className="px-4 py-2.5 text-[var(--ink-dim)]">{event.page_path || "/"}</td>
                  <td className="px-4 py-2.5 text-[var(--ink-dim)]">
                    {event.target || event.section || event.value || "-"}
                  </td>
                  <td className="max-w-[10rem] truncate px-4 py-2.5 text-xs text-[var(--ink-faint)]">
                    {event.visitor_id || "-"}
                  </td>
                  <td className="px-4 py-2.5 text-[var(--ink-dim)]">{event.utm_source || "direct"}</td>
                </tr>
              ))}
              {events.rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-[var(--ink-faint)]">
                    No events match these filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>

      <Pager
        page={events.page}
        pageCount={events.pageCount}
        hrefFor={(page) => {
          const search = new URLSearchParams();
          if (filters.type !== "all") search.set("type", filters.type);
          search.set("days", String(filters.days));
          if (page > 1) search.set("page", String(page));
          return `/admin/events?${search.toString()}`;
        }}
      />
    </div>
  );
}
