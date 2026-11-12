/**
 * Small in-process fixed-window limiter.
 *
 * It protects a single Node instance (local, docker, or one serverless instance).
 * For fleet-wide enforcement configure the platform instead (Vercel Firewall /
 * Upstash), see FIX-GUIDE A1.
 */
type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();
const MAX_TRACKED_KEYS = 5000;

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();

  if (buckets.size > MAX_TRACKED_KEYS) {
    buckets.forEach((bucket, bucketKey) => {
      if (bucket.resetAt <= now) buckets.delete(bucketKey);
    });
  }

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: Math.max(0, limit - 1), retryAfterSeconds: 0 };
  }

  existing.count += 1;
  if (existing.count > limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  return { allowed: true, remaining: Math.max(0, limit - existing.count), retryAfterSeconds: 0 };
}

/** Test hook: lets the verification scripts reset quotas between runs. */
export function resetRateLimits() {
  buckets.clear();
}

/**
 * Peek without consuming. Used by the analytics Basic Auth gate: only *failed*
 * attempts count, so a legitimate visitor is never locked out by their own
 * successful logins.
 */
export function isRateLimited(key: string, limit: number) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    return { allowed: true, retryAfterSeconds: 0 };
  }
  return {
    allowed: bucket.count < limit,
    retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
  };
}

export function recordFailure(key: string, windowMs: number) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }
  bucket.count += 1;
}
