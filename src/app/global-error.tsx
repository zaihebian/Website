"use client";

import { useEffect } from "react";

// global-error replaces the root layout, so it cannot rely on globals.css.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app] global error", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7f9fa",
          color: "#0a0d11",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        }}
      >
        <main
          style={{
            maxWidth: "32rem",
            margin: "1rem",
            padding: "2.5rem",
            borderRadius: "1.5rem",
            border: "1px solid rgba(10,13,17,0.08)",
            background: "#ffffff",
            boxShadow: "0 20px 52px rgba(12,28,40,0.1)",
            textAlign: "center",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "1.75rem", letterSpacing: "-0.02em" }}>The site could not start</h1>
          <p style={{ margin: "1rem 0 0", lineHeight: 1.6, color: "rgba(10,13,17,0.72)" }}>
            An unexpected error stopped the page from rendering. Reloading usually fixes it.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1.75rem",
              borderRadius: "9999px",
              border: "none",
              padding: "0.875rem 1.75rem",
              fontSize: "0.9375rem",
              fontWeight: 600,
              color: "#f8fafb",
              background: "linear-gradient(180deg,#1b2229,#0a0d11)",
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </main>
      </body>
    </html>
  );
}
