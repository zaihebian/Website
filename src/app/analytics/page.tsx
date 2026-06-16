import Link from "next/link";
import type { ReactNode } from "react";
import {
  BEHAVIOR_EVENTS_TABLE,
  getDashboardData,
  isBehaviorDbConfigured,
  type BehaviorEventRow,
  type CountRow,
  type LeadSubmissionRow,
} from "@/lib/behaviorEvents";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  if (!isBehaviorDbConfigured()) {
    return (
      <main className="min-h-screen bg-[#07090c] px-4 py-10 text-[var(--ink)] sm:px-6">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[var(--line)] bg-white/[0.04] p-8">
          <p className="text-sm uppercase tracking-[0.18em] text-[var(--accent)]">Analytics</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">Supabase is not configured</h1>
          <p className="mt-3 text-[var(--ink-dim)]">
            Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to load LiqenTech behavior data.
          </p>
        </div>
      </main>
    );
  }

  const data = await getDashboardData();
  const insights = buildInsights(data);

  return (
    <main className="min-h-screen bg-[#07090c] px-4 py-8 text-[var(--ink)] sm:px-6 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-6 border-b border-[var(--line)] pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">LiqenTech Analytics</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Visitor behavior dashboard</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--ink-dim)]">
              Live analysis from `{BEHAVIOR_EVENTS_TABLE}` with source attribution, funnel signals, and lead intent.
            </p>
          </div>
          <Link href="/" className="btn-secondary w-fit">
            Back to site
          </Link>
        </header>

        <section className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Visitors" value={data.totals.visitors} helper={`${data.totals.sessions} sessions`} />
          <Metric label="Leads" value={data.totals.leads} helper={`${formatPercent(data.totals.conversionRate)} conversion`} accent />
          <Metric label="Events" value={data.totals.events} helper="tracked interactions" />
          <Metric label="Avg. scroll" value={`${Math.round(data.totals.averageScrollDepth)}%`} helper="from scroll milestones" />
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Panel title="Daily momentum" subtitle="Events and leads over the latest tracked days">
            <Timeline events={data.dailyEvents} leads={data.dailyLeads} />
          </Panel>
          <Panel title="Insights" subtitle="Automatic readout from current data">
            <div className="space-y-3">
              {insights.map((insight) => (
                <div key={insight} className="rounded-xl border border-[var(--line)] bg-white/[0.035] p-4 text-sm leading-6 text-[var(--ink-dim)]">
                  {insight}
                </div>
              ))}
            </div>
          </Panel>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-3">
          <Panel title="Traffic sources" subtitle="Where sessions appear to come from">
            <BarList rows={data.sourceBreakdown.slice(0, 8)} />
          </Panel>
          <Panel title="Lead sources" subtitle="Channels producing form submissions">
            <BarList rows={data.leadSources.slice(0, 8)} empty="No leads yet" />
          </Panel>
          <Panel title="Scroll depth" subtitle="How far people get down the page">
            <BarList rows={data.scrollDepth} />
          </Panel>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-3">
          <Panel title="Viewed sections" subtitle="Sections entering the viewport">
            <BarList rows={data.sectionViews.slice(0, 10)} />
          </Panel>
          <Panel title="Top clicks" subtitle="Buttons and links getting attention">
            <BarList rows={data.clicks.slice(0, 10)} empty="No clicks yet" />
          </Panel>
          <Panel title="Campaigns" subtitle="UTM campaigns captured in events">
            <BarList rows={data.campaignBreakdown.slice(0, 10)} />
          </Panel>
        </section>

        <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_1.15fr]">
          <Panel title="Recent leads" subtitle="Latest consultation submissions">
            <LeadTable rows={data.recentLeads} />
          </Panel>
          <Panel title="Recent events" subtitle="Latest behavior stream">
            <EventTable rows={data.recentEvents} />
          </Panel>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value, helper, accent = false }: { label: string; value: number | string; helper: string; accent?: boolean }) {
  return (
    <article className="rounded-2xl border border-[var(--line)] bg-white/[0.045] p-5">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--ink-faint)]">{label}</p>
      <p className={`mt-4 text-3xl font-semibold tracking-tight ${accent ? "text-[var(--accent)]" : "text-[var(--ink)]"}`}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      <p className="mt-2 text-sm text-[var(--ink-faint)]">{helper}</p>
    </article>
  );
}

function Panel({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-[var(--line)] bg-white/[0.035] p-5">
      <div className="mb-5">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-[var(--ink-faint)]">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function BarList({ rows, empty = "No data yet" }: { rows: CountRow[]; empty?: string }) {
  if (!rows.length) return <p className="text-sm text-[var(--ink-faint)]">{empty}</p>;
  const max = Math.max(...rows.map((row) => row.count), 1);
  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.label}>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="min-w-0 truncate text-[var(--ink-dim)]">{cleanLabel(row.label)}</span>
            <strong className="text-[var(--ink)]">{row.count.toLocaleString()}</strong>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.06]">
            <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${Math.max(6, (row.count / max) * 100)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Timeline({ events, leads }: { events: CountRow[]; leads: CountRow[] }) {
  const dates = [...new Set([...events.map((row) => row.label), ...leads.map((row) => row.label)])].slice(-14);
  const max = Math.max(...events.map((row) => row.count), ...leads.map((row) => row.count), 1);
  const eventMap = new Map(events.map((row) => [row.label, row.count]));
  const leadMap = new Map(leads.map((row) => [row.label, row.count]));

  if (!dates.length) return <p className="text-sm text-[var(--ink-faint)]">No timeline data yet</p>;

  return (
    <div className="flex h-56 items-end gap-2">
      {dates.map((date) => {
        const eventCount = eventMap.get(date) ?? 0;
        const leadCount = leadMap.get(date) ?? 0;
        return (
          <div key={date} className="flex min-w-0 flex-1 flex-col items-center gap-2">
            <div className="flex h-44 w-full items-end justify-center gap-1 rounded-xl bg-white/[0.025] px-1 py-2">
              <div className="w-3 rounded-t-full bg-white/35" style={{ height: `${Math.max(4, (eventCount / max) * 100)}%` }} title={`${eventCount} events`} />
              <div className="w-3 rounded-t-full bg-[var(--accent)]" style={{ height: `${Math.max(4, (leadCount / max) * 100)}%` }} title={`${leadCount} leads`} />
            </div>
            <span className="w-full truncate text-center text-[10px] text-[var(--ink-faint)]">{date.slice(5)}</span>
          </div>
        );
      })}
    </div>
  );
}

function LeadTable({ rows }: { rows: LeadSubmissionRow[] }) {
  if (!rows.length) return <p className="text-sm text-[var(--ink-faint)]">No lead submissions yet</p>;
  return (
    <div className="max-h-[34rem] overflow-auto">
      <table className="w-full min-w-[42rem] text-left text-sm">
        <thead className="sticky top-0 bg-[#0b0e12] text-xs uppercase tracking-[0.14em] text-[var(--ink-faint)]">
          <tr>
            <th className="py-3 pr-4">Lead</th>
            <th className="py-3 pr-4">Company</th>
            <th className="py-3 pr-4">Source</th>
            <th className="py-3 pr-4">Scroll</th>
            <th className="py-3">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--line)]">
          {rows.map((lead) => (
            <tr key={lead.id}>
              <td className="py-3 pr-4">
                <div className="font-medium text-[var(--ink)]">{lead.name || "Unknown"}</div>
                <div className="text-xs text-[var(--ink-faint)]">{lead.email}</div>
              </td>
              <td className="py-3 pr-4 text-[var(--ink-dim)]">{lead.company || "-"}</td>
              <td className="py-3 pr-4 text-[var(--ink-dim)]">{lead.utm_source || "direct"}</td>
              <td className="py-3 pr-4 text-[var(--ink-dim)]">{lead.max_scroll_depth ?? 0}%</td>
              <td className="py-3 text-[var(--ink-dim)]">{formatDate(lead.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EventTable({ rows }: { rows: BehaviorEventRow[] }) {
  if (!rows.length) return <p className="text-sm text-[var(--ink-faint)]">No events yet</p>;
  return (
    <div className="max-h-[34rem] overflow-auto">
      <table className="w-full min-w-[44rem] text-left text-sm">
        <thead className="sticky top-0 bg-[#0b0e12] text-xs uppercase tracking-[0.14em] text-[var(--ink-faint)]">
          <tr>
            <th className="py-3 pr-4">Event</th>
            <th className="py-3 pr-4">Page</th>
            <th className="py-3 pr-4">Detail</th>
            <th className="py-3 pr-4">Source</th>
            <th className="py-3">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--line)]">
          {rows.map((event) => (
            <tr key={event.id}>
              <td className="py-3 pr-4 font-medium text-[var(--ink)]">{event.type}</td>
              <td className="py-3 pr-4 text-[var(--ink-dim)]">{event.page_path || "/"}</td>
              <td className="py-3 pr-4 text-[var(--ink-dim)]">{event.target || event.section || event.value || "-"}</td>
              <td className="py-3 pr-4 text-[var(--ink-dim)]">{event.utm_source || "direct"}</td>
              <td className="py-3 text-[var(--ink-dim)]">{formatDate(event.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function buildInsights(data: Awaited<ReturnType<typeof getDashboardData>>) {
  const topSource = data.sourceBreakdown[0];
  const topLeadSource = data.leadSources[0];
  const topSection = data.sectionViews[0];
  const topClick = data.clicks[0];

  return [
    data.totals.leads
      ? `${data.totals.leads.toLocaleString()} lead submissions have been captured, with a ${formatPercent(data.totals.conversionRate)} visitor-to-lead conversion rate.`
      : "No leads have been captured yet; focus testing on consultation-intent journeys and form completion.",
    topSource
      ? `${cleanLabel(topSource.label)} is currently the largest traffic source with ${topSource.count.toLocaleString()} tracked events.`
      : "Traffic source data is not available yet.",
    topLeadSource
      ? `${cleanLabel(topLeadSource.label)} is producing the most leads so far. Compare it with event volume to spot over- or under-performing channels.`
      : "Lead source attribution will appear once form submissions include UTM or referrer data.",
    topSection
      ? `${cleanLabel(topSection.label)} is the most-viewed section. If leads are weak, move stronger consultation cues near this area.`
      : "Section visibility data is still sparse.",
    topClick
      ? `${cleanLabel(topClick.label)} is the most common click target. Treat it as the clearest intent signal in the current journey.`
      : "Click data is still sparse.",
  ];
}

function formatPercent(value: number) {
  return `${value.toFixed(value >= 10 ? 0 : 1)}%`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function cleanLabel(value: string) {
  return value.replaceAll("_", " ").replaceAll("-", " ");
}
