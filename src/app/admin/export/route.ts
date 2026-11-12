import type { NextRequest } from "next/server";
import { parseLeadFilters } from "@/app/admin/filters";
import { exportLeadsCsv } from "@/lib/adminQueries";
import { isBehaviorDbConfigured } from "@/lib/behaviorEvents";

export const dynamic = "force-dynamic";

function parseParams(request: NextRequest) {
  const params: Record<string, string | string[] | undefined> = {};
  request.nextUrl.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

export async function GET(request: NextRequest) {
  if (!isBehaviorDbConfigured()) {
    return new Response("Supabase is not configured", { status: 503 });
  }

  const filters = parseLeadFilters(parseParams(request));

  try {
    const csv = await exportLeadsCsv(filters);
    const stamp = new Date().toISOString().slice(0, 10);
    return new Response(`\uFEFF${csv}`, {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="liqentech-leads-${stamp}.csv"`,
        "cache-control": "no-store",
      },
    });
  } catch (error) {
    console.error("[admin] CSV export failed", error);
    return new Response("Export failed", { status: 500 });
  }
}
