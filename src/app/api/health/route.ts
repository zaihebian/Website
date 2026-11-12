import { NextResponse } from "next/server";
import { isBehaviorDbConfigured } from "@/lib/behaviorEvents";
import { isMauticApiConfigured } from "@/lib/mautic";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Secrets-free readiness probe. `ready` means every backend the site writes to is
 * configured; `ok` only says the app is up (degraded mode still serves the site).
 */
export async function GET() {
  const supabaseConfigured = isBehaviorDbConfigured();
  const mauticConfigured = isMauticApiConfigured();
  const analyticsAuthConfigured = Boolean(process.env.ANALYTICS_USERNAME && process.env.ANALYTICS_PASSWORD);

  return NextResponse.json(
    {
      ok: true,
      ready: supabaseConfigured && mauticConfigured && analyticsAuthConfigured,
      supabaseConfigured,
      mauticConfigured,
      analyticsAuthConfigured,
    },
    { headers: { "cache-control": "no-store" } },
  );
}
