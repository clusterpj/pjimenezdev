// Thin GA4 wrapper. Everything no-ops if NEXT_PUBLIC_GA_ID isn't set, so
// local dev and previews without the env var stay silent.
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

/** Queue a gtag call. Pushes straight into `dataLayer` rather than requiring
 *  `window.gtag` to exist first — `dataLayer` is a queue that gtag.js drains
 *  when it loads, so nothing is lost by firing before the library arrives.
 *
 *  The old code bailed on `!window.gtag`, silently dropping every event in the
 *  window between React hydrating and gtag.js finishing its download. */
function queue(...args: unknown[]) {
  if (!GA_ID || typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  // gtag.js reads queue entries positionally, so an array is equivalent to the
  // `arguments` object the canonical inline snippet pushes.
  window.dataLayer.push(args);
}

/** Send a GA4 page_view.
 *
 *  Was `gtag("config", GA_ID, { page_path: url })` — two bugs in one line:
 *
 *  1. `page_path` is a Universal Analytics field. GA4 keys its page dimensions
 *     off `page_location` (an absolute URL), so the path never arrived and GA4
 *     fell back to whatever it could infer — the direct cause of sessions
 *     showing "(not set)" as the landing page.
 *  2. Re-issuing `config` on each navigation is the UA pattern; GA4 wants an
 *     explicit `page_view` event.
 *
 *  `page_location` has to be absolute — GA4 drops a relative value. */
export function pageview(path: string) {
  if (typeof window === "undefined") return;
  queue("event", "page_view", {
    page_location: new URL(path, window.location.origin).href,
    page_path: path,
    page_title: document.title,
  });
}

/** Fire a GA4 event. Use recommended event names where they exist
 *  (generate_lead) so they slot into GA4's default reporting. */
export function trackEvent(action: string, params: Record<string, unknown> = {}) {
  queue("event", action, params);
}
