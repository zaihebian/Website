import { describe, expect, it } from "vitest";
import { isSameOrigin, maskIp, sanitizeMetadata } from "@/lib/eventPayload";

describe("sanitizeMetadata", () => {
  it("keeps only whitelisted fields", () => {
    const result = sanitizeMetadata(
      {
        maxScrollDepth: 60,
        clickedTargets: ["hero-cta"],
        viewedSections: ["systems"],
        hasQuery: true,
        evil: "x".repeat(500),
        nested: { a: 1 },
      },
      false,
    );
    expect(result).toEqual({
      maxScrollDepth: 60,
      clickedTargets: ["hero-cta"],
      viewedSections: ["systems"],
      hasQuery: true,
    });
    expect(result).not.toHaveProperty("evil");
    expect(result).not.toHaveProperty("nested");
  });

  it("clamps and rounds scroll depth to 0..100", () => {
    expect(sanitizeMetadata({ maxScrollDepth: 999 }, false).maxScrollDepth).toBe(100);
    expect(sanitizeMetadata({ maxScrollDepth: -20 }, false).maxScrollDepth).toBe(0);
    expect(sanitizeMetadata({ maxScrollDepth: 42.7 }, false).maxScrollDepth).toBe(43);
    expect(sanitizeMetadata({ maxScrollDepth: "not a number" }, false)).not.toHaveProperty("maxScrollDepth");
  });

  it("caps arrays at 20 entries and 64 characters", () => {
    const clickedTargets = Array.from({ length: 30 }, (_, index) => `target-${index}-${"x".repeat(80)}`);
    const result = sanitizeMetadata({ clickedTargets }, false);
    const stored = result.clickedTargets as string[];
    expect(stored).toHaveLength(20);
    stored.forEach((entry) => expect(entry.length).toBeLessThanOrEqual(64));
  });

  it("accepts a uuid submission id and rejects anything else", () => {
    const uuid = "3f2b8c1e-9a4d-4f6b-8c2e-1d0a5b7e9c33";
    expect(sanitizeMetadata({ submissionId: uuid }, false).submissionId).toBe(uuid);
    expect(sanitizeMetadata({ submissionId: "not-a-uuid" }, false)).not.toHaveProperty("submissionId");
    expect(sanitizeMetadata({ submissionId: 42 }, false)).not.toHaveProperty("submissionId");
  });

  it("ignores a non-boolean hasQuery", () => {
    expect(sanitizeMetadata({ hasQuery: "yes" }, false)).not.toHaveProperty("hasQuery");
  });

  it("marks synthetic traffic only when asked", () => {
    expect(sanitizeMetadata({}, true).synthetic).toBe(true);
    expect(sanitizeMetadata({}, false)).not.toHaveProperty("synthetic");
  });

  it("returns an empty object for undefined metadata", () => {
    expect(sanitizeMetadata(undefined, false)).toEqual({});
  });
});

describe("maskIp", () => {
  it("masks the last IPv4 octet", () => {
    expect(maskIp("203.0.113.45")).toBe("203.0.113.0");
  });

  it("keeps only the first four IPv6 groups", () => {
    expect(maskIp("2001:db8:85a3:8d3:1319:8a2e:370:7348")).toBe("2001:db8:85a3:8d3::");
  });

  it("degrades safely for missing or malformed values", () => {
    expect(maskIp(null)).toBeNull();
    expect(maskIp("   ")).toBeNull();
    expect(maskIp("not-an-ip")).toBe("ipv4");
    expect(maskIp("fe80::1")).toBe("ipv6");
  });
});

describe("isSameOrigin", () => {
  it("allows requests without an Origin header (curl, beacons)", () => {
    expect(isSameOrigin(null, ["liqentech.com"])).toBe(true);
  });

  it("allows the matching host and hostname (port insensitive)", () => {
    expect(isSameOrigin("http://127.0.0.1:3000", ["127.0.0.1:3000"])).toBe(true);
    expect(isSameOrigin("https://liqentech.com", ["www.liqentech.com", "liqentech.com"])).toBe(true);
    expect(isSameOrigin("https://liqentech.com:443", ["liqentech.com:3000"])).toBe(true);
  });

  it("rejects a foreign origin", () => {
    expect(isSameOrigin("https://evil.example", ["liqentech.com", "127.0.0.1:3000"])).toBe(false);
  });

  it("rejects unparsable origins and tolerates empty candidates", () => {
    expect(isSameOrigin("not a url", ["liqentech.com"])).toBe(false);
    expect(isSameOrigin("https://liqentech.com", [null, undefined, ""])).toBe(false);
  });
});
