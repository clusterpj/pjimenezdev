import { getCloudflareContext } from "@opennextjs/cloudflare";

type RateLimiter = { limit(opts: { key: string }): Promise<{ success: boolean }> };

/** Per-IP limiter for the AI/email endpoints (see [[ratelimits]] in wrangler.toml).
 *
 *  KNOWN NOT ENFORCING IN PRODUCTION (verified 2026-07-30). The binding resolves
 *  and limit() is called with the right key, but returns success:true for every
 *  request — 22 sequential same-IP calls inside one 60s window against a 12/60s
 *  limit were all admitted. Confirmed via `wrangler tail` with a temporary probe;
 *  tried both the inline-table and documented sub-table config forms. It works in
 *  `wrangler dev --local`, so this is the deployed binding, not the code.
 *  Real protection has to come from a zone-level WAF rate-limiting rule on
 *  /api/* — see docs/STATUS.md. This stays wired up so it starts working the day
 *  the binding does.
 *
 *  Fails OPEN — a broken limiter must never block real leads. It used to fail open
 *  *silently*, which is exactly why the above went unnoticed; every failure path
 *  now logs so `wrangler tail` surfaces it. The absent-binding case is normal in
 *  plain `next dev`, so it logs once per isolate rather than per request. */
let warnedMissing = false;

export async function rateLimited(req: Request): Promise<boolean> {
  let env: { AI_RATE_LIMITER?: RateLimiter };
  try {
    env = getCloudflareContext().env as { AI_RATE_LIMITER?: RateLimiter };
  } catch (err) {
    console.error("[rate-limit] getCloudflareContext threw:", err instanceof Error ? err.message : err);
    return false;
  }

  const limiter = env?.AI_RATE_LIMITER;
  if (!limiter || typeof limiter.limit !== "function") {
    if (!warnedMissing) {
      warnedMissing = true;
      console.error(
        "[rate-limit] AI_RATE_LIMITER binding is not available at runtime — requests are UNLIMITED.",
        "env keys:", env ? Object.keys(env).join(",") : "(no env)",
      );
    }
    return false;
  }

  const key = req.headers.get("cf-connecting-ip") ?? "unknown";
  try {
    const { success } = await limiter.limit({ key });
    return !success;
  } catch (err) {
    console.error("[rate-limit] limit() threw:", err instanceof Error ? err.message : err);
    return false;
  }
}
