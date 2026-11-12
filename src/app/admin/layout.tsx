import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const links = [
  { href: "/admin", label: "Leads" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/export", label: "Export CSV" },
  { href: "/analytics", label: "Analytics" },
  { href: "/", label: "Site" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const envLabel = (process.env.SUPABASE_ENV_LABEL ?? "").trim();
  const looksProduction = /prod/i.test(envLabel);

  return (
    <div className="min-h-[100dvh] bg-[var(--bg)] text-[var(--ink)]">
      <header className="border-b border-[var(--line)] bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold tracking-tight">LiqenTech Admin</span>
            <span className="rounded-full bg-[rgba(10,13,17,0.06)] px-2 py-0.5 text-[11px] text-[var(--ink-faint)]">
              internal
            </span>
            {envLabel ? (
              <span
                className={
                  looksProduction
                    ? "rounded-full bg-[rgba(180,120,20,0.16)] px-2 py-0.5 text-[11px] font-medium text-[#8a5a00]"
                    : "rounded-full bg-[rgba(13,110,140,0.12)] px-2 py-0.5 text-[11px] font-medium text-[#0d6e8c]"
                }
              >
                db: {envLabel}
              </span>
            ) : null}
          </div>
          <nav className="flex flex-wrap items-center gap-1 text-sm">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-1.5 text-[var(--ink-dim)] transition hover:bg-[rgba(10,13,17,0.05)] hover:text-[var(--ink)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
