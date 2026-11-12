#!/usr/bin/env node
/**
 * Post-deploy smoke test for a deployed URL (staging preview, Vercel production,
 * or a local `next start`). Read-only by default; `--with-lead` additionally posts
 * one clearly marked synthetic lead so the whole pipeline can be proven end to end.
 *
 * Usage:
 *   node scripts/check-deployment.mjs --base https://liqentech.com
 *   node scripts/check-deployment.mjs --base http://127.0.0.1:3000 --user u --pass p
 *   node scripts/check-deployment.mjs --base https://liqentech.com --with-lead
 *
 * Exit codes: 0 all checks pass, 1 failed checks, 2 bad usage.
 */
const args = process.argv.slice(2);
function argValue(name) {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? undefined : args[index + 1];
}
const base = (argValue("base") ?? process.env.SMOKE_BASE ?? "").replace(/\/$/, "");
const user = argValue("user") ?? process.env.SMOKE_USER;
const pass = argValue("pass") ?? process.env.SMOKE_PASS;
const withLead = args.includes("--with-lead");

if (!base) {
  console.error("Usage: node scripts/check-deployment.mjs --base https://<domain> [--user u --pass p] [--with-lead]");
  process.exit(2);
}

const authHeader = user && pass ? { authorization: `Basic ${Buffer.from(`${user}:${pass}`).toString("base64")}` } : {};
const checks = [];
const check = (name, pass_, detail) => checks.push({ name, pass: Boolean(pass_), detail });

async function get(path_, headers = {}) {
  const response = await fetch(`${base}${path_}`, { headers: { ...authHeader, ...headers }, redirect: "manual" });
  const text = await response.text();
  return { status: response.status, headers: response.headers, text };
}

// --- public surface ---------------------------------------------------------
{
  const home = await get("/");
  check("首页 200", home.status === 200, home.status);
  const headers = home.headers;
  check(
    "安全响应头齐全",
    headers.get("x-content-type-options") === "nosniff" &&
      Boolean(headers.get("referrer-policy")) &&
      Boolean(headers.get("x-frame-options")),
    {
      nosniff: headers.get("x-content-type-options"),
      referrer: headers.get("referrer-policy"),
      frame: headers.get("x-frame-options"),
      poweredBy: headers.get("x-powered-by"),
    },
  );
  check("不再泄露 X-Powered-By", headers.get("x-powered-by") === null, headers.get("x-powered-by"));
}

{
  const privacy = await get("/privacy");
  check("隐私政策页 200", privacy.status === 200, privacy.status);
  const sitemap = await get("/sitemap.xml");
  const sitemapText = sitemap.text;
  check(
    "sitemap 含 /privacy 且不含 /success",
    sitemap.status === 200 && sitemapText.includes("/privacy") && !sitemapText.includes("/success"),
    sitemap.status,
  );
  const robots = await get("/robots.txt");
  const robotsText = robots.text;
  check("robots 屏蔽 /analytics", robots.status === 200 && /Disallow: \/analytics/.test(robotsText), robots.status);
}

{
  const health = await get("/api/health");
  let parsed = null;
  try {
    parsed = JSON.parse(health.text);
  } catch {
    parsed = null;
  }
  check("/api/health 返回 200", health.status === 200, health.status);
  check(
    "/api/health 三个配置开关存在且不含密钥",
    Boolean(parsed) &&
      typeof parsed.supabaseConfigured === "boolean" &&
      typeof parsed.mauticConfigured === "boolean" &&
      typeof parsed.analyticsAuthConfigured === "boolean" &&
      !/key|password|https?:\/\//i.test(JSON.stringify(parsed)),
    parsed,
  );
}

{
  // Basic Auth: probe without credentials first, then with them when given.
  const anonymousAdmin = await fetch(`${base}/admin`, { redirect: "manual" });
  check("/admin 未认证被拦截（401，未配置凭据时为 503）", [401, 503].includes(anonymousAdmin.status), {
    status: anonymousAdmin.status,
    hint: anonymousAdmin.status === 404 ? "该环境尚未部署 admin，或代码未上线" : undefined,
  });

  const anonymousAnalytics = await fetch(`${base}/analytics`, { redirect: "manual" });
  check("/analytics 未认证被拦截", [401, 503].includes(anonymousAnalytics.status), anonymousAnalytics.status);

  if (authHeader.authorization) {
    const adminAuthed = await get("/admin");
    check("/admin 凭据可进入（200）", adminAuthed.status === 200, adminAuthed.status);
    const analyticsAuthed = await get("/analytics");
    check("/analytics 凭据可进入（200）", analyticsAuthed.status === 200, analyticsAuthed.status);
  }
}

{
  const mtc = await get("/api/mautic/mtc.js");
  check(`Mautic 追踪脚本可用（200）或已优雅降级（502），当前 ${mtc.status}`, mtc.status === 200 || mtc.status === 502, mtc.status);
}

// --- optional end-to-end lead ----------------------------------------------
if (withLead) {
  const stamp = Date.now();
  const email = `smoke-${stamp}@example.com`;
  const response = await fetch(`${base}/api/behavior-events`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-synthetic-visitor": `smoke-${stamp}` },
    body: JSON.stringify({
      type: "form_submit",
      visitorId: `smoke-${stamp}`,
      pagePath: "/",
      metadata: { synthetic: true, hasQuery: true, maxScrollDepth: 50, viewedSections: ["systems"] },
      contact: { email, name: "Deployment Smoke", company: "Smoke", query: "synthetic smoke test" },
    }),
  });
  const body = await response.json().catch(() => null);
  check("合成线索提交返回 200", response.status === 200 && body?.ok === true, { status: response.status, sinks: body?.sinks });
  check("线索至少落一个 sink", Boolean(body?.sinks?.behaviorEvent || body?.sinks?.leadSubmission || body?.sinks?.mautic), body?.sinks);
  check("合成线索使用可清理的邮箱（记录备查）", email.endsWith("@example.com"), email);
}

const failed = checks.filter((item) => !item.pass);
console.log(
  JSON.stringify(
    { base, checks, summary: { total: checks.length, passed: checks.length - failed.length, failed: failed.map((item) => item.name) } },
    null,
    2,
  ),
);
process.exit(failed.length ? 1 : 0);
