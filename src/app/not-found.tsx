import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center px-4 py-16 sm:px-6">
      <div className="glass w-full max-w-lg rounded-3xl p-8 text-center sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">404</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--ink)]">This page does not exist</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--ink-dim)]">
          The link may be out of date. Start from the home page, or jump straight to the systems and contact sections.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-primary w-full sm:w-auto">
            Back to home
          </Link>
          <Link href="/careers" className="btn-secondary w-full sm:w-auto">
            See open roles
          </Link>
        </div>
      </div>
    </main>
  );
}
