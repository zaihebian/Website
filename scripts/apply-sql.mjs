#!/usr/bin/env node
/**
 * Applies SQL files to the database behind DATABASE_URL (see .env.local).
 *
 * The hosted Supabase SQL editor is the usual path; this exists so a migration can
 * be applied from CI or a shell without psql. Every file runs inside its own
 * transaction: a failing file rolls back instead of half-migrating.
 *
 * Usage:
 *   npm run db:apply -- supabase-liqentech-admin.sql
 *   node scripts/apply-sql.mjs file1.sql file2.sql
 *   DATABASE_URL=postgresql://... node scripts/apply-sql.mjs --dry-run supabase-liqentech-admin.sql
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { Client } from "pg";

const root = process.cwd();

function loadEnv() {
  const fromFile = {};
  const file = path.join(root, ".env.local");
  if (existsSync(file)) {
    for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const separator = trimmed.indexOf("=");
      if (separator === -1) continue;
      fromFile[trimmed.slice(0, separator).trim()] = trimmed.slice(separator + 1).trim();
    }
  }
  return { ...fromFile, ...process.env };
}

const env = loadEnv();
const args = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
const dryRun = process.argv.includes("--dry-run");
const databaseUrl = env.DATABASE_URL ?? "";

if (!args.length) {
  console.error("Usage: node scripts/apply-sql.mjs [--dry-run] <file.sql> [more.sql]");
  process.exit(2);
}

if (!dryRun && !databaseUrl) {
  console.error("Missing DATABASE_URL (set it in .env.local or the environment).");
  process.exit(2);
}

const files = args.map((arg) => path.resolve(root, arg));
for (const file of files) {
  if (!existsSync(file)) {
    console.error(`Missing file: ${file}`);
    process.exit(2);
  }
}

if (dryRun) {
  console.log(JSON.stringify({ dryRun: true, files: files.map((file) => path.basename(file)) }, null, 2));
  process.exit(0);
}

const redactedTarget = (() => {
  try {
    const parsed = new URL(databaseUrl);
    return `${parsed.hostname}/${parsed.pathname.replace(/^\//, "")}`;
  } catch {
    return "<unparsable DATABASE_URL>";
  }
})();
console.log(`[apply-sql] target ${redactedTarget}`);

const client = new Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
  for (const file of files) {
    const sql = readFileSync(file, "utf8");
    console.log(`[apply-sql] applying ${path.basename(file)} (${sql.length} bytes)`);
    try {
      await client.query("begin");
      await client.query(sql);
      await client.query("commit");
      console.log(`[apply-sql] ok ${path.basename(file)}`);
    } catch (error) {
      await client.query("rollback").catch(() => {});
      console.error(`[apply-sql] FAILED ${path.basename(file)}: ${error.message}`);
      process.exitCode = 1;
      break;
    }
  }
} catch (error) {
  console.error(`[apply-sql] connection failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
