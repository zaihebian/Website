import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteLeadAction, updateLeadAction } from "@/app/admin/actions";
import { AdminNotice, Card, StatusPill, SyncPill, formatDateTime } from "@/app/admin/ui";
import { LEAD_STATUS_LABELS, getLead, getLeadEvents } from "@/lib/adminQueries";
import { LEAD_STATUSES, isBehaviorDbConfigured } from "@/lib/behaviorEvents";

export const dynamic = "force-dynamic";

type LeadPageProps = {
  params: Promise<{ id: string }>;
};

function Field({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="grid gap-1">
      <dt className="text-[11px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">{label}</dt>
      <dd className="break-words text-sm text-[var(--ink)]">{value ?? "-"}</dd>
    </div>
  );
}

export default async function LeadDetailPage({ params }: LeadPageProps) {
  if (!isBehaviorDbConfigured()) {
    return (
      <AdminNotice title="Supabase is not configured">
        The admin backend cannot read leads until Supabase credentials and the admin SQL migration are in place.
      </AdminNotice>
    );
  }

  const { id } = await params;
  const leadId = Number(id);
  if (!Number.isInteger(leadId) || leadId <= 0) notFound();

  const lead = await getLead(leadId);
  if (!lead) notFound();

  const events = await getLeadEvents(lead, 40);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin" className="text-sm text-[var(--accent)] underline underline-offset-4">
            ← All leads
          </Link>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            {lead.name || "Unknown"} <span className="text-[var(--ink-faint)]">#{lead.id}</span>
          </h1>
          <p className="mt-1 text-sm text-[var(--ink-dim)]">
            {lead.email} · received {formatDateTime(lead.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusPill status={lead.status} />
          <SyncPill status={lead.mautic_sync_status} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <h2 className="text-lg font-semibold tracking-tight">Enquiry</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[var(--ink-dim)]">
            {lead.query || "No message left."}
          </p>

          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Company" value={lead.company} />
            <Field label="Page" value={lead.page_path} />
            <Field label="Source" value={lead.utm_source || lead.referrer} />
            <Field label="Campaign" value={lead.utm_campaign} />
            <Field label="Max scroll" value={lead.max_scroll_depth != null ? `${lead.max_scroll_depth}%` : null} />
            <Field
              label="Clicked targets"
              value={Array.isArray(lead.clicked_targets) ? lead.clicked_targets.join(", ") : null}
            />
            <Field
              label="Viewed sections"
              value={Array.isArray(lead.viewed_sections) ? lead.viewed_sections.join(", ") : null}
            />
            <Field label="IP hint" value={lead.ip_hint} />
            <Field label="Visitor" value={lead.visitor_id} />
            <Field label="Session" value={lead.session_id} />
          </dl>
        </Card>

        <div className="space-y-4">
          <Card>
            <h2 className="text-lg font-semibold tracking-tight">Maintenance</h2>
            <form action={updateLeadAction} className="mt-4 space-y-3">
              <input type="hidden" name="id" value={lead.id} />
              <label className="block text-xs text-[var(--ink-faint)]">
                Status
                <select name="status" defaultValue={lead.status ?? "new"} className="field mt-1 h-10 py-2">
                  {LEAD_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {LEAD_STATUS_LABELS[status]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs text-[var(--ink-faint)]">
                Notes
                <textarea
                  name="notes"
                  rows={4}
                  defaultValue={lead.notes ?? ""}
                  placeholder="Call summary, next step, owner…"
                  className="field mt-1 resize-y py-2"
                />
              </label>
              <button type="submit" className="btn-primary w-full !py-2.5 text-sm">
                Save
              </button>
            </form>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold tracking-tight">Mautic snapshot</h2>
            <p className="mt-2 text-xs leading-relaxed text-[var(--ink-faint)]">
              What this submission sends to Mautic (independent of whether the Mautic host is reachable).
            </p>
            <dl className="mt-3 grid gap-3">
              <Field label="Sync status" value={lead.mautic_sync_status ?? "pending"} />
              <Field label="Contact id" value={lead.mautic_contact_id} />
              <Field label="Points" value={lead.mautic_points} />
              <Field
                label="Tags"
                value={Array.isArray(lead.mautic_tags) ? lead.mautic_tags.join(", ") : null}
              />
            </dl>
          </Card>

          <Card className="border-[rgba(178,52,52,0.25)] bg-[rgba(178,52,52,0.04)]">
            <h2 className="text-lg font-semibold tracking-tight">Delete lead</h2>
            <p className="mt-2 text-xs leading-relaxed text-[var(--ink-dim)]">
              Removes this lead and every behaviour event stored for the same visitor or session. Use for erasure
              requests; it cannot be undone.
            </p>
            <form action={deleteLeadAction} className="mt-3">
              <input type="hidden" name="id" value={lead.id} />
              <button
                type="submit"
                className="rounded-full border border-[rgba(178,52,52,0.35)] px-4 py-2 text-sm font-medium text-[#8a2222] transition hover:bg-[rgba(178,52,52,0.08)]"
              >
                Delete lead and events
              </button>
            </form>
          </Card>
        </div>
      </div>

      <Card className="p-0">
        <div className="flex items-center justify-between px-5 pt-5">
          <h2 className="text-lg font-semibold tracking-tight">Behaviour timeline</h2>
          <span className="text-xs text-[var(--ink-faint)]">{events.length} event(s)</span>
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="border-y border-[var(--line)] text-[11px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
              <tr>
                <th className="px-5 py-3">When</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Target / section</th>
                <th className="px-5 py-3">Path</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="whitespace-nowrap px-5 py-2.5 text-[var(--ink-dim)]">
                    {formatDateTime(event.created_at)}
                  </td>
                  <td className="px-5 py-2.5 font-medium">{event.type}</td>
                  <td className="px-5 py-2.5 text-[var(--ink-dim)]">
                    {event.target || event.section || event.value || "-"}
                  </td>
                  <td className="px-5 py-2.5 text-[var(--ink-dim)]">{event.page_path || "/"}</td>
                </tr>
              ))}
              {events.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-[var(--ink-faint)]">
                    No behaviour rows linked to this visitor yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
