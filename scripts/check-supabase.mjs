#!/usr/bin/env node
/**
 * Staging/production Supabase self-check (FIX-GUIDE-style, no Docker needed).
 *
 * Verifies, against a REAL Supabase project:
 *   1. the project answers on the REST API with the service role key
 *   2. `liqentech_behavior_events` exists
 *   3. `liqentech_lead_submissions` has the admin columns (supabase-liqentech-admin.sql)
 *   4. a lead round-trip: insert -> read -> update status/notes -> delete
 *   5. an event round-trip: insert -> read -> delete
 *
 * It only touches rows it creates (site_source = staging-check) and removes them
 * afterwards. Credentials come from the environment or .env.local.
 *
 * Usage:
 *   npm run check:supabase
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/check-supabase.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const EVENTS = "liqentech_behavior_events";
const LEADS = "liqentech_lead_submissions";
const ADMIN_COLUMNS = [
  "status",
  "notes",
  "updated_at",
  "mautic_contact_id",
  "mautic_sync_status",
  "mautic_tags",
  "mautic_points",
];

function loadEnv() {
  const fromFile = {};
  const file = path.join(root, ".env.local");
  if (existsSync(file)) {
    for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const separator = trimmed.indexOf("=");
      if (separator === -1) continue;
      const key = trimmed.slice(0, separator).trim();
      let value = trimmed.slice(separator + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      fromFile[key] = value;
    }
  }
  return { ...fromFile, ...process.env };
}

const env = loadEnv();
const url = (env.SUPABASE_URL ?? "").replace(/\/$/, "");
const key = env.SUPABASE_SERVICE_ROLE_KEY ?? "";

const checks = [];
const check = (name, pass, detail) => checks.push({ name, pass: Boolean(pass), detail });

if (!url || !key) {
  console.error(
    [
      "Missing credentials.",
      "  SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set (environment or .env.local).",
      "  For the staging setup see DEPLOYMENT.md section 8.",
    ].join("\n"),
  );
  process.exit(2);
}

const headers = {
  apikey: key,
  authorization: `Bearer ${key}`,
  "content-type": "application/json",
};
const writeHeaders = { ...headers, prefer: "return=representation" };

async function rest(resource, init = {}) {
  const response = await fetch(`${url}/rest/v1/${resource}`, { ...init, headers: { ...headers, ...init.headers } });
  const text = await response.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text.slice(0, 200);
  }
  return { status: response.status, body, headers: response.headers };
}

const stamp = Date.now();
const email = `staging-check-${stamp}@example.com`;
const visitorId = `staging-check-${stamp}`;
const created = { leadId: null, eventId: null };

function fail(status, body) {
  return `HTTP ${status}: ${typeof body === "string" ? body : JSON.stringify(body)?.slice(0, 200)}`;
}

try {
  // 1. reachability + events table
  const eventsProbe = await rest(`${EVENTS}?select=id&limit=1`);
  check("Supabase REST 可达 / behavior_events 存在", eventsProbe.status === 200, {
    status: eventsProbe.status,
    hint: eventsProbe.status === 401 ? "service role key 不对" : eventsProbe.status === 404 ? "先执行 supabase-liqentech-behavior-events.sql" : undefined,
  });

  // 2. admin columns
  const leadProbe = await rest(`${LEADS}?select=id,${ADMIN_COLUMNS.join(",")}&limit=1`);
  const missingColumns = leadProbe.status === 400;
  check("lead_submissions 含 admin 字段（状态/备注/Mautic 快照）", leadProbe.status === 200, {
    status: leadProbe.status,
    hint: missingColumns ? "先执行 supabase-liqentech-admin.sql" : undefined,
    body: leadProbe.status === 200 ? undefined : fail(leadProbe.status, leadProbe.body),
  });

  // 3. lead round-trip
  const insertLead = await rest(LEADS, {
    method: "POST",
    headers: writeHeaders,
    body: JSON.stringify({
      site_source: "staging-check",
      email,
      name: "Staging Check",
      company: "Self-test",
      query: "row created by scripts/check-supabase.mjs",
      status: "new",
      mautic_sync_status: "skipped",
      mautic_tags: ["staging-check"],
      mautic_points: 0,
    }),
  });
  const insertedLead = Array.isArray(insertLead.body) ? insertLead.body[0] : insertLead.body;
  created.leadId = insertedLead?.id ?? null;
  check("插入线索成功", insertLead.status === 201 || insertLead.status === 200, {
    status: insertLead.status,
    id: created.leadId,
    body: insertLead.status < 300 ? undefined : fail(insertLead.status, insertLead.body),
  });

  const readLead = await rest(`${LEADS}?select=id,email,status,notes&email=eq.${encodeURIComponent(email)}`);
  const leadRow = Array.isArray(readLead.body) ? readLead.body[0] : null;
  check("按邮箱读回线索", Boolean(leadRow) && leadRow.status === "new", leadRow);

  if (created.leadId) {
    const updateLead = await rest(`${LEADS}?id=eq.${created.leadId}`, {
      method: "PATCH",
      headers: writeHeaders,
      body: JSON.stringify({ status: "contacted", notes: "staging self-check", updated_at: new Date().toISOString() }),
    });
    const updatedRow = Array.isArray(updateLead.body) ? updateLead.body[0] : null;
    check("更新状态/备注成功", updateLead.status < 300 && updatedRow?.status === "contacted", {
      status: updateLead.status,
      notes: updatedRow?.notes,
    });

    const deleteLead = await rest(`${LEADS}?id=eq.${created.leadId}`, { method: "DELETE" });
    const afterDelete = await rest(`${LEADS}?select=id&id=eq.${created.leadId}`);
    check("删除线索成功", deleteLead.status < 300 && Array.isArray(afterDelete.body) && afterDelete.body.length === 0, {
      status: deleteLead.status,
    });
    created.leadId = null;
  }

  // 4. event round-trip
  const insertEvent = await rest(EVENTS, {
    method: "POST",
    headers: writeHeaders,
    body: JSON.stringify({
      site_source: "staging-check",
      type: "staging_check",
      visitor_id: visitorId,
      page_path: "/staging-check",
      metadata_json: { synthetic: true, stagingCheck: true },
    }),
  });
  const insertedEvent = Array.isArray(insertEvent.body) ? insertEvent.body[0] : insertEvent.body;
  created.eventId = insertedEvent?.id ?? null;
  check("插入行为事件成功", insertEvent.status === 201 || insertEvent.status === 200, {
    status: insertEvent.status,
    id: created.eventId,
  });

  const readEvent = await rest(`${EVENTS}?select=id,type,metadata_json&visitor_id=eq.${encodeURIComponent(visitorId)}`);
  const eventRow = Array.isArray(readEvent.body) ? readEvent.body[0] : null;
  check("按 visitor_id 读回事件", Boolean(eventRow) && eventRow.type === "staging_check", eventRow);

  if (created.eventId) {
    const deleteEvent = await rest(`${EVENTS}?id=eq.${created.eventId}`, { method: "DELETE" });
    check("删除行为事件成功", deleteEvent.status < 300, { status: deleteEvent.status });
    created.eventId = null;
  }
} catch (error) {
  check("自检执行异常", false, String(error).slice(0, 300));
} finally {
  // Best effort cleanup if a step above failed mid-way.
  if (created.leadId) {
    await rest(`${LEADS}?id=eq.${created.leadId}`, { method: "DELETE" }).catch(() => {});
  }
  if (created.eventId) {
    await rest(`${EVENTS}?id=eq.${created.eventId}`, { method: "DELETE" }).catch(() => {});
  }
}

const failed = checks.filter((item) => !item.pass);
console.log(
  JSON.stringify(
    {
      target: url,
      checks,
      summary: { total: checks.length, passed: checks.length - failed.length, failed: failed.map((item) => item.name) },
    },
    null,
    2,
  ),
);
process.exit(failed.length ? 1 : 0);
