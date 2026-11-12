import { describe, expect, it } from "vitest";
import { readDelivery } from "@/lib/delivery";
import { readStoredJson } from "@/lib/storage";

describe("readDelivery", () => {
  const respond = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

  it("accepts a 200 with ok/stored", async () => {
    await expect(readDelivery(respond({ ok: true, stored: true }))).resolves.toEqual({
      ok: true,
      status: 200,
      stored: true,
      error: undefined,
    });
  });

  it("treats the server's ok:false as a failure even with HTTP 200", async () => {
    const result = await readDelivery(respond({ ok: false, stored: false }));
    expect(result.ok).toBe(false);
    expect(result.stored).toBe(false);
  });

  it("keeps the server error message on 503", async () => {
    const result = await readDelivery(respond({ ok: false, error: "Lead could not be stored" }, 503));
    expect(result).toEqual({ ok: false, status: 503, stored: false, error: "Lead could not be stored" });
  });

  it("falls back to an HTTP error when the body is not JSON", async () => {
    const result = await readDelivery(new Response("<html>bad gateway</html>", { status: 502 }));
    expect(result.ok).toBe(false);
    expect(result.error).toBe("HTTP 502");
  });

  it("accepts a JSON 200 without an ok field (older deployments)", async () => {
    const result = await readDelivery(respond({}));
    expect(result.ok).toBe(true);
    expect(result.stored).toBe(false);
  });
});

describe("readStoredJson", () => {
  const storage = (value: string | null) => ({ getItem: () => value });

  it("returns the parsed value", () => {
    expect(readStoredJson(storage('["a","b"]'), "key", [])).toEqual(["a", "b"]);
  });

  it("returns the fallback for a missing key", () => {
    expect(readStoredJson(storage(null), "key", ["fallback"])).toEqual(["fallback"]);
  });

  it("returns the fallback for corrupted JSON", () => {
    expect(readStoredJson(storage("{not json"), "key", 0)).toBe(0);
  });

  it("returns the fallback when storage is unavailable or throws", () => {
    expect(readStoredJson(null, "key", "fallback")).toBe("fallback");
    const throwing = {
      getItem: () => {
        throw new Error("blocked by browser");
      },
    };
    expect(readStoredJson(throwing, "key", "fallback")).toBe("fallback");
  });
});
