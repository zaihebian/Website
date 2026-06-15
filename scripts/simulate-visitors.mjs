import { chromium, devices } from "playwright";
import { randomUUID } from "node:crypto";

const defaults = {
  url: "https://liqentech.com",
  visitors: 25,
  concurrency: 3,
  headless: true,
  submitForms: false,
  minDelay: 450,
  maxDelay: 2200,
};

const args = parseArgs(process.argv.slice(2));
const config = {
  ...defaults,
  url: String(args.url ?? process.env.SIM_BASE_URL ?? defaults.url).replace(/\/$/, ""),
  visitors: toNumber(args.visitors ?? process.env.SIM_VISITORS, defaults.visitors),
  concurrency: toNumber(args.concurrency ?? process.env.SIM_CONCURRENCY, defaults.concurrency),
  headless: !hasFlag(args, "headed"),
  submitForms: hasFlag(args, "submit-forms") || process.env.SIM_SUBMIT_FORMS === "1",
  minDelay: toNumber(args.minDelay ?? process.env.SIM_MIN_DELAY, defaults.minDelay),
  maxDelay: toNumber(args.maxDelay ?? process.env.SIM_MAX_DELAY, defaults.maxDelay),
};

const deviceProfiles = [
  { name: "Desktop Chrome", viewport: { width: 1440, height: 900 }, locale: "en-US", timezoneId: "America/New_York" },
  { name: "Desktop Safari", viewport: { width: 1366, height: 768 }, locale: "en-GB", timezoneId: "Europe/London" },
  { name: "iPhone 13", device: devices["iPhone 13"], locale: "en-US", timezoneId: "America/Los_Angeles" },
  { name: "Pixel 7", device: devices["Pixel 7"], locale: "en-GB", timezoneId: "Europe/Dublin" },
];

const referrers = [
  "https://www.google.com/search?q=ai+automation+agency",
  "https://www.google.com/search?q=software+development+consulting",
  "https://www.linkedin.com/",
  "https://x.com/",
  "https://www.bing.com/search?q=ai+business+automation",
  undefined,
];

const campaigns = [
  "",
  "?utm_source=google&utm_medium=organic&utm_campaign=ai_automation",
  "?utm_source=linkedin&utm_medium=social&utm_campaign=consulting",
  "?utm_source=direct&utm_medium=none&utm_campaign=brand",
];

const scenarios = [
  {
    name: "services-researcher",
    weight: 34,
    run: async (page, visitor) => {
      await land(page, visitor);
      await scrollToRatio(page, 0.28);
      await maybeClick(page, 'a[href="#systems"], a[href="/#systems"]');
      await dwell();
      await scrollToRatio(page, 0.62);
      await hoverText(page, "AI Automation Systems");
      await scrollToRatio(page, 0.9);
    },
  },
  {
    name: "consultation-intent",
    weight: 28,
    run: async (page, visitor) => {
      await land(page, visitor);
      await scrollToRatio(page, 0.18);
      await clickByRole(page, "button", /book a consultation/i);
      await fillConsultationForm(page, visitor);
      if (config.submitForms) {
        await clickByRole(page, "button", /send request/i);
        await page.waitForURL(/\/success/, { timeout: 5000 }).catch(() => {});
      } else {
        await page.keyboard.press("Escape").catch(() => {});
      }
    },
  },
  {
    name: "careers-browser",
    weight: 16,
    run: async (page, visitor) => {
      await land(page, visitor);
      await goTo(page, `${config.url}/careers`, visitor.referrer);
      await scrollToRatio(page, 0.25);
      await hoverText(page, "AI Engineer");
      await scrollToRatio(page, 0.68);
      await maybeClick(page, 'a[href^="mailto:careers@"]');
    },
  },
  {
    name: "skeptical-short-visit",
    weight: 14,
    run: async (page, visitor) => {
      await land(page, visitor);
      await scrollToRatio(page, 0.12);
      await dwell(800, 1800);
    },
  },
  {
    name: "deep-evaluator",
    weight: 8,
    run: async (page, visitor) => {
      await land(page, visitor);
      await scrollToRatio(page, 0.35);
      await maybeClick(page, 'a[href="#why"], a[href="/#why"]');
      await scrollToRatio(page, 0.72);
      await goTo(page, `${config.url}/careers`, visitor.referrer);
      await scrollToRatio(page, 0.55);
      await goTo(page, `${config.url}/`, visitor.referrer);
      await clickByRole(page, "button", /book a consultation/i);
      await fillConsultationForm(page, visitor);
      await page.keyboard.press("Escape").catch(() => {});
    },
  },
];

await main();

async function main() {
  const browser = await chromium.launch({
    headless: config.headless,
    args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"],
  });

  const queue = Array.from({ length: config.visitors }, (_, index) => index + 1);
  const results = [];
  const workerCount = Math.min(config.concurrency, config.visitors);

  await Promise.all(
    Array.from({ length: workerCount }, async () => {
      while (queue.length > 0) {
        const visitorNumber = queue.shift();
        const result = await runVisitor(browser, visitorNumber).catch((error) => ({
          visitorNumber,
          ok: false,
          error: error.message,
        }));
        results.push(result);
        const status = result.ok ? "ok" : `failed: ${result.error}`;
        console.log(`[visitor ${visitorNumber}] ${result.scenario ?? "unknown"} ${status}`);
      }
    }),
  );

  await browser.close();

  const ok = results.filter((result) => result.ok).length;
  console.log(`completed ${ok}/${config.visitors} synthetic visitors against ${config.url}`);
}

async function runVisitor(browser, visitorNumber) {
  const profile = pick(deviceProfiles);
  const scenario = weightedPick(scenarios);
  const visitor = createVisitor(visitorNumber, profile, scenario.name);
  const context = await browser.newContext({
    ...(profile.device ?? {}),
    viewport: profile.viewport ?? profile.device.viewport,
    locale: profile.locale,
    timezoneId: profile.timezoneId,
    colorScheme: Math.random() > 0.82 ? "dark" : "light",
    extraHTTPHeaders: {
      "x-synthetic-visitor": visitor.id,
    },
  });

  await context.addInitScript(({ id, scenarioName }) => {
    window.__syntheticVisitor = { id, scenario: scenarioName };
  }, { id: visitor.id, scenarioName: scenario.name });

  const page = await context.newPage();
  page.setDefaultTimeout(8000);

  try {
    await scenario.run(page, visitor);
    await dwell(900, 2600);
    return { visitorNumber, scenario: scenario.name, ok: true };
  } finally {
    await context.close();
  }
}

function createVisitor(visitorNumber, profile, scenarioName) {
  const id = `sim-${visitorNumber}-${randomUUID().slice(0, 8)}`;
  const company = pick(["Northstar Ops", "Bluepeak Systems", "Aster Labs", "Nexus Retail", "Harbor AI"]);
  return {
    id,
    scenarioName,
    referrer: pick(referrers),
    landingPath: pick(campaigns),
    name: pick(["Alex Carter", "Sam Morgan", "Jamie Lee", "Taylor Brooks", "Casey Patel"]),
    email: `${id}@example.com`,
    company,
    query: `Looking at AI automation and software systems for ${company}.`,
    profileName: profile.name,
  };
}

async function land(page, visitor) {
  await goTo(page, `${config.url}/${visitor.landingPath}`, visitor.referrer);
}

async function goTo(page, url, referrer) {
  await page.goto(url, { waitUntil: "domcontentloaded", referer: referrer });
  await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
  await dwell();
}

async function fillConsultationForm(page, visitor) {
  await page.getByLabel(/^name$/i).fill(visitor.name).catch(() => {});
  await dwell(250, 700);
  await page.getByLabel(/^email$/i).fill(visitor.email).catch(() => {});
  await dwell(250, 700);
  await page.getByLabel(/company/i).fill(visitor.company).catch(() => {});
  await dwell(250, 700);
  await page.getByLabel(/query/i).fill(visitor.query).catch(() => {});
  await dwell(500, 1300);
}

async function scrollToRatio(page, ratio) {
  await page.evaluate((targetRatio) => {
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    window.scrollTo({ top: maxScroll * targetRatio, behavior: "smooth" });
  }, ratio);
  await dwell(900, 2200);
}

async function clickByRole(page, role, name) {
  const locator = page.getByRole(role, { name }).first();
  if ((await locator.count()) > 0) {
    await locator.click();
    await dwell();
  }
}

async function maybeClick(page, selector) {
  const locator = page.locator(selector).first();
  if ((await locator.count()) > 0 && Math.random() > 0.3) {
    await locator.click().catch(() => {});
    await dwell();
  }
}

async function hoverText(page, text) {
  await page.getByText(text, { exact: false }).first().hover().catch(() => {});
  await dwell(500, 1600);
}

async function dwell(min = config.minDelay, max = config.maxDelay) {
  await new Promise((resolve) => setTimeout(resolve, randomInt(min, max)));
}

function weightedPick(items) {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let cursor = Math.random() * total;
  for (const item of items) {
    cursor -= item.weight;
    if (cursor <= 0) return item;
  }
  return items.at(-1);
}

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function parseArgs(rawArgs) {
  const parsed = {};
  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = rawArgs[index + 1];
    if (!next || next.startsWith("--")) {
      parsed[key] = true;
      continue;
    }
    parsed[key] = next;
    index += 1;
  }
  return parsed;
}

function hasFlag(parsed, flag) {
  return parsed[flag] === true || parsed[flag] === "true";
}

function toNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}
