/**
 * Request-side helpers for the public tracking endpoint. Extracted from the route
 * so they can be unit-tested without a Next.js request object.
 */
const MAX_LIST_ITEMS = 20;
const MAX_LABEL_LENGTH = 64;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function metaNumber(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function metaList(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, MAX_LIST_ITEMS).map((item) => String(item).slice(0, MAX_LABEL_LENGTH));
}

/**
 * Keeps only the fields the site actually writes. Client-supplied JSON is never
 * merged wholesale into JSONB: unbounded keys and arrays are a cheap way to bloat
 * the table and to smuggle junk into the dashboard.
 */
export function sanitizeMetadata(metadata: Record<string, unknown> | undefined, synthetic: boolean) {
  const out: Record<string, unknown> = {};
  const scrollDepth = metaNumber(metadata?.maxScrollDepth);
  if (scrollDepth !== undefined) {
    out.maxScrollDepth = Math.min(100, Math.max(0, Math.round(scrollDepth)));
  }

  const clickedTargets = metaList(metadata?.clickedTargets);
  if (clickedTargets.length) out.clickedTargets = clickedTargets;

  const viewedSections = metaList(metadata?.viewedSections);
  if (viewedSections.length) out.viewedSections = viewedSections;

  if (typeof metadata?.hasQuery === "boolean") out.hasQuery = metadata.hasQuery;
  if (synthetic) out.synthetic = true;

  const submissionId = typeof metadata?.submissionId === "string" ? metadata.submissionId : "";
  if (UUID_PATTERN.test(submissionId)) out.submissionId = submissionId;

  if (typeof metadata?.language === "string") out.language = metadata.language.slice(0, 16);
  const viewportWidth = metaNumber(metadata?.viewportWidth);
  if (viewportWidth !== undefined) out.viewportWidth = Math.round(viewportWidth);
  const viewportHeight = metaNumber(metadata?.viewportHeight);
  if (viewportHeight !== undefined) out.viewportHeight = Math.round(viewportHeight);

  return out;
}

/**
 * Stores a coarse network hint instead of the full address (data minimisation).
 * IPv4 keeps the first three octets, IPv6 the first four groups.
 */
export function maskIp(ip: string | null) {
  if (!ip) return null;
  const trimmed = ip.trim();
  if (!trimmed) return null;
  if (trimmed.includes(":")) {
    const groups = trimmed.split(":").filter(Boolean);
    return groups.length >= 4 ? `${groups.slice(0, 4).join(":")}::` : "ipv6";
  }
  const octets = trimmed.split(".");
  return octets.length === 4 ? `${octets[0]}.${octets[1]}.${octets[2]}.0` : "ipv4";
}

/**
 * A missing Origin is allowed (curl, privacy modes, some beacons) and is handled by
 * rate limiting instead. A present Origin must match one of the request's hosts.
 */
export function isSameOrigin(origin: string | null, candidates: Array<string | null | undefined>) {
  if (!origin) return true;

  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }

  const originHostname = originHost.split(":")[0];
  return candidates
    .filter((value): value is string => Boolean(value))
    .some((host) => host === originHost || host.split(":")[0] === originHostname);
}
