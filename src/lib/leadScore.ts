/**
 * Lead scoring and tagging for Mautic. Pure functions, unit-tested in
 * tests/unit/leadScore.test.ts.
 */
export type MauticBehaviorSummary = {
  maxScrollDepth?: number;
  clickedTargets?: string[];
  viewedSections?: string[];
  hasMessage?: boolean;
};

export function calculatePoints(summary: MauticBehaviorSummary) {
  let points = 50;
  if ((summary.maxScrollDepth ?? 0) >= 50) points += 5;
  if ((summary.maxScrollDepth ?? 0) >= 75) points += 10;
  if ((summary.maxScrollDepth ?? 0) >= 100) points += 5;
  if (summary.clickedTargets?.some(isHighIntentTarget)) points += 15;
  if (summary.viewedSections?.some((section) => ["systems", "why-us", "contact"].includes(section))) points += 10;
  if (summary.hasMessage) points += 10;
  return points;
}

export function buildTags(summary: MauticBehaviorSummary) {
  const tags = ["site:liqentech", "liqentech-lead", "landing-form-submit"];

  if ((summary.maxScrollDepth ?? 0) >= 75) tags.push("high-scroll-depth");
  if (summary.clickedTargets?.some(isHighIntentTarget)) tags.push("clicked-consultation-cta");
  if (summary.viewedSections?.includes("systems")) tags.push("viewed-systems");
  if (summary.viewedSections?.includes("why-us")) tags.push("viewed-why-us");
  if (summary.hasMessage) tags.push("submitted-message");

  return tags;
}

export function isHighIntentTarget(target: string) {
  return target.includes("cta") || target.includes("consultation") || target.includes("contact");
}

export function flattenFields(fields: Record<string, string | string[] | undefined>) {
  const params: Record<string, string> = {};
  Object.entries(fields).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        params[`${key}[${index}]`] = item;
      });
      return;
    }
    if (value) params[key] = value;
  });
  return params;
}
