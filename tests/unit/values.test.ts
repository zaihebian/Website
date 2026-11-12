import { describe, expect, it } from "vitest";
import { longTextValue, textValue } from "@/lib/behaviorEvents";

describe("textValue", () => {
  it("returns null for null/undefined", () => {
    expect(textValue(null)).toBeNull();
    expect(textValue(undefined)).toBeNull();
  });

  it("stringifies numbers and booleans", () => {
    expect(textValue(42)).toBe("42");
    expect(textValue(false)).toBe("false");
  });

  it("truncates to 500 characters", () => {
    expect(textValue("x".repeat(600))).toHaveLength(500);
  });
});

describe("longTextValue", () => {
  it("keeps up to 5000 characters", () => {
    expect(longTextValue("y".repeat(9000))).toHaveLength(5000);
    expect(longTextValue("hello")).toBe("hello");
  });

  it("returns null for empty input", () => {
    expect(longTextValue(null)).toBeNull();
    expect(longTextValue(undefined)).toBeNull();
  });
});
