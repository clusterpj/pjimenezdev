// Thin GA4 wrapper. Everything no-ops if NEXT_PUBLIC_GA_ID isn't set, so
// local dev and previews without the env var stay silent.
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export function pageview(url: string) {
  if (!GA_ID || typeof window === "undefined" || !window.gtag) return;
  window.gtag("config", GA_ID, { page_path: url });
}

/** Fire a GA4 event. Use recommended event names where they exist
 *  (generate_lead) so they slot into GA4's default reporting. */
export function trackEvent(action: string, params: Record<string, unknown> = {}) {
  if (!GA_ID || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", action, params);
}
