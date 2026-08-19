/**
 * In-process sliding-window rate limiter.
 *
 * Deliberately dependency-free: this site runs as a single Node process, so a Map
 * is enough. Two limits to be aware of before scaling:
 *
 *  - State is per-process. Behind several instances (or on serverless, where each
 *    invocation may be a cold process) each one keeps its own counters, so the
 *    effective limit multiplies by the instance count.
 *  - State is lost on restart.
 *
 * If the site moves to multiple instances, swap the Map for Redis/Upstash — the
 * `check()` signature is designed to stay the same.
 */

interface Bucket {
  /** Timestamps of accepted hits inside the current window. */
  hits: number[];
}

const buckets = new Map<string, Bucket>();

/** Stops the Map growing without bound if many distinct IPs appear. */
const MAX_TRACKED_KEYS = 10_000;

export interface RateLimitResult {
  ok: boolean;
  limit: number;
  remaining: number;
  /** Seconds until the caller may retry. Only meaningful when `ok` is false. */
  retryAfter: number;
}

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): RateLimitResult {
  const now = Date.now();
  const cutoff = now - windowMs;

  let bucket = buckets.get(key);
  if (!bucket) {
    // Evict the oldest keys wholesale rather than walking every entry on the hot
    // path; this only runs when the map is already at its cap.
    if (buckets.size >= MAX_TRACKED_KEYS) {
      for (const k of Array.from(buckets.keys()).slice(0, MAX_TRACKED_KEYS / 2)) {
        buckets.delete(k);
      }
    }
    bucket = { hits: [] };
    buckets.set(key, bucket);
  }

  bucket.hits = bucket.hits.filter((t) => t > cutoff);

  if (bucket.hits.length >= limit) {
    const oldest = bucket.hits[0];
    return {
      ok: false,
      limit,
      remaining: 0,
      retryAfter: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)),
    };
  }

  bucket.hits.push(now);
  return { ok: true, limit, remaining: limit - bucket.hits.length, retryAfter: 0 };
}

/**
 * Best-effort client identity.
 *
 * `x-forwarded-for` is only trustworthy when a proxy you control sets it. Behind
 * Vercel/Cloudflare/nginx that holds; exposed directly to the internet a client
 * can forge it, so this is a speed bump for casual abuse, not an access control.
 */
export function clientKey(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
