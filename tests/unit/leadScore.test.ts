import { describe, expect, it } from "vitest";
import { buildTags, calculatePoints, flattenFields, isHighIntentTarget } from "@/lib/leadScore";

describe("calculatePoints", () => {
  it("gives the 50-point base score for an empty summary", () => {
    expect(calculatePoints({})).toBe(50);
  });

  it("reaches the 105-point maximum for the full journey", () => {
    expect(
      calculatePoints({
        maxScrollDepth: 100,
        clickedTargets: ["hero-consultation-cta"],
        viewedSections: ["systems", "why-us"],
        hasMessage: true,
      }),
    ).toBe(105);
  });

  it("adds scroll weights at 50/75/100 only", () => {
    expect(calculatePoints({ maxScrollDepth: 49 })).toBe(50);
    expect(calculatePoints({ maxScrollDepth: 50 })).toBe(55);
    expect(calculatePoints({ maxScrollDepth: 75 })).toBe(65);
    expect(calculatePoints({ maxScrollDepth: 100 })).toBe(70);
  });

  it("ignores sections that are not relevant", () => {
    expect(calculatePoints({ viewedSections: ["careers", "hero"] })).toBe(50);
    expect(calculatePoints({ viewedSections: ["contact"] })).toBe(60);
  });
});

describe("buildTags", () => {
  it("always carries the three base tags", () => {
    expect(buildTags({})).toEqual(["site:liqentech", "liqentech-lead", "landing-form-submit"]);
  });

  it("adds behavioural tags", () => {
    expect(
      buildTags({
        maxScrollDepth: 80,
        clickedTargets: ["contact-email"],
        viewedSections: ["systems", "why-us"],
        hasMessage: true,
      }),
    ).toEqual([
      "site:liqentech",
      "liqentech-lead",
      "landing-form-submit",
      "high-scroll-depth",
      "clicked-consultation-cta",
      "viewed-systems",
      "viewed-why-us",
      "submitted-message",
    ]);
  });
});

describe("isHighIntentTarget", () => {
  it.each(["hero-cta", "consultation-modal", "contact-email", "nav-consultation-cta"])("treats %s as intent", (target) => {
    expect(isHighIntentTarget(target)).toBe(true);
  });

  it.each(["nav-systems", "careers-email", "footer"])("does not treat %s as intent", (target) => {
    expect(isHighIntentTarget(target)).toBe(false);
  });
});

describe("flattenFields", () => {
  it("drops empty values and expands arrays with indices", () => {
    expect(
      flattenFields({
        email: "a@example.com",
        firstname: "",
        company: undefined,
        tags: ["one", "two"],
      }),
    ).toEqual({ email: "a@example.com", "tags[0]": "one", "tags[1]": "two" });
  });
});
