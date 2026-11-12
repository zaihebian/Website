"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app] unhandled error", error);
  }, [error]);

  return (
    <main className="flex min-h-[100dvh] items-center justify-center px-4 py-16 sm:px-6">
      <div className="glass w-full max-w-lg rounded-3xl p-8 text-center sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">Something went wrong</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--ink)]">This page hit an error</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--ink-dim)]">
          The page could not be rendered. Try again, or go back to the home page — your data was not affected.
        </p>
        {error.digest ? (
          <p className="mt-3 text-xs text-[var(--ink-faint)]">Reference: {error.digest}</p>
        ) : null}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button type="button" onClick={reset} className="btn-primary w-full sm:w-auto">
            Try again
          </button>
          <Link href="/" className="btn-secondary w-full sm:w-auto">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
