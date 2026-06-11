import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const base = "http://localhost:3000";
mkdirSync("shots", { recursive: true });

const browser = await chromium.launch({
  headless: true,
  args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto(base, { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
await page.screenshot({ path: "shots/01-hero.png" });

const positions = [0.18, 0.36, 0.55, 0.75, 0.95];
for (let i = 0; i < positions.length; i++) {
  await page.evaluate((p) => {
    window.scrollTo({ top: (document.body.scrollHeight - window.innerHeight) * p, behavior: "instant" });
  }, positions[i]);
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `shots/0${i + 2}-scroll-${Math.round(positions[i] * 100)}.png` });
}

await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await page.waitForTimeout(800);
await page.getByRole("button", { name: "Book a consultation" }).first().click();
await page.waitForTimeout(1000);
await page.screenshot({ path: "shots/07-modal.png" });

await page.goto(`${base}/careers`, { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
await page.screenshot({ path: "shots/08-careers.png" });

await page.goto(`${base}/success`, { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
await page.screenshot({ path: "shots/09-success.png" });

// Mobile hero
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(base, { waitUntil: "networkidle" });
await mobile.waitForTimeout(2200);
await mobile.screenshot({ path: "shots/10-mobile-hero.png" });

await browser.close();
console.log("done");
