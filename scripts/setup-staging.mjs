#!/usr/bin/env node
/**
 * One-command staging setup for LiqenTech (Option B: staging project, no Docker).
 *
 * Requires a Supabase Management API token (Dashboard → Account → Access Tokens,
 * scope: all or the target org). The token is only read from the environment or
 * --token, never written to disk.
 *
 * What it does (idempotent where the API allows it):
 *   1. create the project (or reuse an existing --ref)
 *   2. wait until the project is ACTIVE_HEALTHY
 *   3. run supabase-liqentech-behavior-events.sql, supabase-liqentech-admin.sql
 *   4. set the PostgREST max-rows cap (default 1000) through SQL
 *   5. fetch the service_role key and write .env.local (never printed)
 *   6. run scripts/check-supabase.mjs as a self-check
 *
 * Usage:
 *   $env:SUPABASE_ACCESS_TOKEN="sbp_..."
 *   node scripts/setup-staging.mjs --org <org-id> [--name liqentech-staging] [--region eu-west-1]
 *   node scripts/setup-staging.mjs --ref <existing-project-ref>
 *   node scripts/setup-staging.mjs --dry-run
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const API = "https://api.supabase.com/v1";
const DEFAULT_NAME = "liqentech-staging";
const DEFAULT_REGION = "eu-west-1";
const SQL_FILES = ["supabase-liqentech-behavior-events.sql", "supabase-liqentech-admin.sql"];
const POLL_INTERVAL_MS = 10_000;
const POLL_TIMEOUT_MS = 10 * 60 * 1000;

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(`--${name}`);
const value = (name, fallback) => {
  const index = argv.indexOf(`--${name}`);
  return index === -1 ? fallback : argv[index + 1];
};

const token = (value("token", process.env.SUPABASE_ACCESS_TOKEN ?? "") ?? "").trim();
let orgId = (value("org", process.env.SUPABASE_ORG_ID ?? "") ?? "").trim();
const projectName = value("name", DEFAULT_NAME);
const region = value("region", DEFAULT_REGION);
const existingRef = value("ref", "");
const maxRows = Number(value("max-rows", "1000"));
const dryRun = flag("dry-run");
const root = process.cwd();

const log = (message) => console.log(`[setup-staging] ${message}`);

if (dryRun) {
  console.log(
    JSON.stringify(
      {
        plan: [
          existingRef ? `reuse project ${existingRef}` : `create project "${projectName}" in ${region} (org ${orgId || "<required>"})`,
          "wait for ACTIVE_HEALTHY",
          `run ${SQL_FILES.join(" → ")} via the Management API query endpoint`,
          `set pgrst.db_max_rows = ${maxRows}`,
          "fetch the service_role key and write .env.local (value never printed)",
          "run scripts/check-supabase.mjs",
        ],
        note: "No credentials are required for --dry-run.",
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

if (token && !/^sbp_[A-Za-z0-9]{16,}$/.test(token)) {
  console.error(
    [
      "SUPABASE_ACCESS_TOKEN does not look like a Supabase Management API token.",
      "  Expected: sbp_ followed by at least 16 ASCII letters/digits (no spaces, no Chinese characters).",
      "  Generate one at https://supabase.com/dashboard/account/tokens and copy the whole value.",
    ].join("\n"),
  );
  process.exit(2);
}

if (!token) {
  console.error(
    [
      "Missing Supabase Management API token.",
      "  Create one at https://supabase.com/dashboard/account/tokens (revoke it afterwards), then:",
      '    $env:SUPABASE_ACCESS_TOKEN="sbp_..."',
      "    node scripts/setup-staging.mjs --org <organization-id>",
      "  List your organizations with:",
      "    $env:SUPABASE_ACCESS_TOKEN=\"sbp_...\"; node scripts/setup-staging.mjs --list-orgs",
    ].join("\n"),
  );
  process.exit(2);
}

async function api(path_, init = {}) {
  const response = await fetch(`${API}${path_}`, {
    ...init,
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      ...init.headers,
    },
  });
  const text = await response.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text.slice(0, 400);
  }
  if (!response.ok) {
    const detail = typeof body === "string" ? body : JSON.stringify(body);
    throw new Error(`${init.method ?? "GET"} ${path_} failed: HTTP ${response.status} ${detail?.slice(0, 300)}`);
  }
  return body;
}

async function runSql(ref, query, label) {
  try {
    await api(`/projects/${ref}/database/query`, { method: "POST", body: JSON.stringify({ query }) });
    log(`SQL ok: ${label}`);
    return true;
  } catch (error) {
    log(`SQL FAILED: ${label} → ${String(error).slice(0, 300)}`);
    return false;
  }
}

async function main() {
  if (flag("list-orgs")) {
    const organizations = await api("/organizations");
    console.log(JSON.stringify(organizations.map(({ id, name }) => ({ id, name })), null, 2));
    return;
  }

  if (!existingRef && !orgId) {
    const organizations = await api("/organizations");
    if (organizations.length === 1) {
      // An organization-scoped token usually sees exactly one organization.
      orgId = organizations[0].id;
      log(`using the only organization available: ${organizations[0].name ?? orgId}`);
    } else {
      console.error(
        [
          "Missing --org. Available organizations:",
          ...organizations.map(({ id, name }) => `  ${name}: ${id}`),
          "",
          "Re-run with: node scripts/setup-staging.mjs --org <id>",
        ].join("\n"),
      );
      process.exit(2);
    }
  }

  // 1. project
  let ref = existingRef;
  if (ref) {
    const project = await api(`/projects/${ref}`);
    log(`using existing project ${project.name ?? ref} (${project.status ?? "unknown"})`);
  } else {
    const dbPass = value("db-pass", "");
    if (!dbPass) {
      log("creating project with a generated database password (reset it in the dashboard if you need it)");
    }
    const created = await api("/projects", {
      method: "POST",
      body: JSON.stringify({
        organization_id: orgId,
        name: projectName,
        region,
        db_pass: dbPass || `Lq${Math.random().toString(36).slice(2, 14)}!${Math.random().toString(36).slice(2, 14)}`,
      }),
    });
    ref = created.id ?? created.ref;
    log(`created project ${projectName} → ref ${ref}`);
  }

  // 2. wait for health
  const deadline = Date.now() + POLL_TIMEOUT_MS;
  let status = "";
  while (Date.now() < deadline) {
    const project = await api(`/projects/${ref}`);
    status = project.status ?? "";
    if (status === "ACTIVE_HEALTHY") break;
    log(`project status ${status || "unknown"}, waiting…`);
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }
  if (status !== "ACTIVE_HEALTHY") {
    console.error(`Project did not become healthy in time (last status: ${status || "unknown"}). Re-run with --ref ${ref}.`);
    process.exit(1);
  }
  log("project is ACTIVE_HEALTHY");

  // 3. schema
  let schemaOk = true;
  for (const file of SQL_FILES) {
    const filePath = path.join(root, file);
    if (!existsSync(filePath)) {
      log(`missing ${file}`);
      schemaOk = false;
      continue;
    }
    schemaOk = (await runSql(ref, readFileSync(filePath, "utf8"), file)) && schemaOk;
  }

  // 4. max rows (PostgREST reads it from the authenticator role)
  await runSql(
    ref,
    `alter role authenticator set pgrst.db_max_rows = '${maxRows}';\nnotify pgrst, 'reload config';`,
    `pgrst.db_max_rows = ${maxRows}`,
  );

  // 5. keys + .env.local
  let serviceRoleKey = "";
  try {
    const keys = await api(`/projects/${ref}/api-keys?reveal=true`);
    serviceRoleKey = keys.find((entry) => (entry.name ?? entry.id) === "service_role")?.api_key ?? "";
  } catch (error) {
    log(`could not read API keys automatically: ${String(error).slice(0, 200)}`);
  }

  if (!serviceRoleKey) {
    console.error(
      [
        "Could not fetch the service_role key automatically.",
        `Copy it from https://supabase.com/dashboard/project/${ref}/settings/api and add to .env.local:`,
        `  SUPABASE_URL=https://${ref}.supabase.co`,
        "  SUPABASE_SERVICE_ROLE_KEY=<service_role>",
      ].join("\n"),
    );
    process.exit(1);
  }

  const envPath = path.join(root, ".env.local");
  const managed = { SUPABASE_URL: `https://${ref}.supabase.co`, SUPABASE_SERVICE_ROLE_KEY: serviceRoleKey };
  const defaults = { ANALYTICS_USERNAME: "dev", ANALYTICS_PASSWORD: "dev" };
  let existing = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";
  const lines = existing ? existing.split(/\r?\n/) : [];
  for (const [key, entry] of Object.entries({ ...managed, ...defaults })) {
    const line = `${key}=${entry}`;
    const index = lines.findIndex((row) => row.trim().startsWith(`${key}=`));
    if (index >= 0) {
      if (key in managed) lines[index] = line;
      continue;
    }
    lines.push(line);
  }
  existing = lines.join("\n").replace(/^\n+/, "");
  writeFileSync(envPath, `${existing.trim()}\n`, "utf8");
  log(`wrote ${envPath} (SUPABASE_URL + service_role + dev analytics credentials; values not printed)`);

  if (!schemaOk) {
    console.error("One or more SQL files failed; check the log above before using this project.");
    process.exit(1);
  }

  // 6. self-check
  log("running scripts/check-supabase.mjs …");
  const result = spawnSync(process.execPath, [path.join(root, "scripts", "check-supabase.mjs")], {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, ...managed },
  });
  if (result.status !== 0) {
    console.error("Self-check failed; see the output above. The .env.local has still been written.");
    process.exit(result.status ?? 1);
  }

  log(
    [
      "staging is ready.",
      "Next: npm run build && npm run start, then open /admin with the dev/dev Basic Auth credentials.",
      "For the deployed environment: npm run check:deployment -- --base <preview-url> --user dev --pass dev",
    ].join("\n"),
  );
}

main().catch((error) => {
  console.error(`[setup-staging] ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
