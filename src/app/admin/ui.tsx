import Link from "next/link";
import type { ReactNode } from "react";
import { LEAD_STATUS_LABELS } from "@/lib/adminQueries";
import type { LeadStatus, MauticSyncStatus } from "@/lib/behaviorEvents";

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: "bg-[rgba(13,110,140,0.12)] text-[#0d6e8c]",
  contacted: "bg-[rgba(180,120,20,0.14)] text-[#8a5a00]",
  qualified: "bg-[rgba(13,110,140,0.2)] text-[#0a5568]",
  won: "bg-[rgba(38,140,80,0.14)] text-[#1f6b3f]",
  lost: "bg-[rgba(10,13,17,0.08)] text-[var(--ink-dim)]",
  spam: "bg-[rgba(178,52,52,0.12)] text-[#8a2222]",
};

const SYNC_STYLES: Record<MauticSyncStatus, string> = {
  pending: "bg-[rgba(180,120,20,0.12)] text-[#8a5a00]",
  synced: "bg-[rgba(38,140,80,0.14)] text-[#1f6b3f]",
  failed: "bg-[rgba(178,52,52,0.12)] text-[#8a2222]",
  skipped: "bg-[rgba(10,13,17,0.08)] text-[var(--ink-dim)]",
};

const SYNC_LABELS: Record<MauticSyncStatus, string> = {
  pending: "Mautic pending",
  synced: "Mautic synced",
  failed: "Mautic failed",
  skipped: "Mautic skipped",
};

export function StatusPill({ status }: { status?: LeadStatus | null }) {
  const value: LeadStatus = status ?? "new";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[value]}`}>
      {LEAD_STATUS_LABELS[value]}
    </span>
  );
}

export function SyncPill({ status }: { status?: MauticSyncStatus | null }) {
  const value: MauticSyncStatus = status ?? "pending";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${SYNC_STYLES[value]}`}>
      {SYNC_LABELS[value]}
    </span>
  );
}

export function formatDateTime(value?: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-[var(--line)] bg-white/75 p-5 ${className}`}>{children}</section>
  );
}

export function Metric({ label, value, hint }: { label: string; value: number | string; hint?: string }) {
  return (
    <Card>
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--ink-faint)]">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
      {hint ? <p className="mt-1 text-sm text-[var(--ink-faint)]">{hint}</p> : null}
    </Card>
  );
}

export function AdminNotice({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Card className="border-[rgba(180,120,20,0.25)] bg-[rgba(214,180,74,0.06)]">
      <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      <div className="mt-2 text-sm leading-relaxed text-[var(--ink-dim)]">{children}</div>
      <Link href="/" className="btn-secondary mt-5 w-fit">
        Back to site
      </Link>
    </Card>
  );
}

export function Pager({
  page,
  pageCount,
  hrefFor,
}: {
  page: number;
  pageCount: number;
  hrefFor: (page: number) => string;
}) {
  if (pageCount <= 1) return null;
  return (
    <div className="mt-4 flex items-center justify-between text-sm text-[var(--ink-dim)]">
      <span>
        Page {page} of {pageCount}
      </span>
      <div className="flex gap-2">
        {page > 1 ? (
          <Link href={hrefFor(page - 1)} className="rounded-full border border-[var(--line)] px-3 py-1.5 hover:text-[var(--ink)]">
            Previous
          </Link>
        ) : null}
        {page < pageCount ? (
          <Link href={hrefFor(page + 1)} className="rounded-full border border-[var(--line)] px-3 py-1.5 hover:text-[var(--ink)]">
            Next
          </Link>
        ) : null}
      </div>
    </div>
  );
}
