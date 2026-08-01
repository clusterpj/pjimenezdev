"use client";

import React, { Suspense } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { GA_ID, pageview, trackEvent } from "@/lib/gtag";

/** Fires a page_view on first paint and on every client-side route change —
 *  App Router navigations don't reload the document, and the automatic initial
 *  page_view is disabled so the two can't double-count.
 *
 *  Split out so the useSearchParams() call doesn't force the whole tree into a
 *  Suspense boundary at the call site. */
function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    if (!GA_ID) return;
    const query = searchParams.toString();
    pageview(pathname + (query ? `?${query}` : ""));
  }, [pathname, searchParams]);

  return null;
}

/** One delegated listener for every outbound / lead click on the site.
 *
 *  GA4 enhanced measurement does NOT count `mailto:` or `tel:` as outbound
 *  clicks — it only watches http(s) links to another host. The site's most-used
 *  CTA is a `mailto:` (home, work, services, about, and every case study aside),
 *  so the highest-intent action a visitor could take was entirely invisible.
 *
 *  Delegated rather than per-link handlers: those pages are server components,
 *  so onClick would mean converting six of them to client components. One
 *  listener also covers any link added later. Capture phase, so a handler
 *  calling stopPropagation can't hide the click. */
function ClickTracker() {
  const pathname = usePathname();

  React.useEffect(() => {
    if (!GA_ID) return;

    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const a = target?.closest?.("a");
      if (!a) return;

      const href = a.getAttribute("href") ?? "";
      if (!href) return;

      // Explicit opt-in wins: data-lead="booking" fires booking_click.
      const explicit = a.getAttribute("data-lead");

      let event: string | null = null;
      if (explicit) event = `${explicit}_click`;
      else if (href.startsWith("mailto:")) event = "email_click";
      else if (href.startsWith("tel:")) event = "phone_click";
      else if (/^https?:\/\//i.test(href)) {
        try {
          if (new URL(href).hostname !== window.location.hostname) event = "outbound_click";
        } catch { /* malformed href — nothing worth reporting */ }
      }
      if (!event) return;

      trackEvent(event, {
        link_url: href,
        link_text: (a.textContent ?? "").trim().slice(0, 100),
        page_path: pathname,
      });
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [pathname]);

  return null;
}

/** Loads gtag.js. No-ops entirely if NEXT_PUBLIC_GA_ID isn't set. */
export function Analytics() {
  if (!GA_ID) return null;

  return (
    <>
      {/* Plain inline <script>, deliberately NOT next/script.
          This was `<Script strategy="afterInteractive">`, which injects only
          AFTER hydration — so `window.gtag` did not exist when PageviewTracker's
          effect ran, the old `!window.gtag` guard bailed, and the landing-page
          page_view was never sent. session_start still fired once gtag.js
          loaded, leaving a session with no page_view and a landing page of
          "(not set)". Being a race is why it hit roughly half of sessions rather
          than all of them.
          Inline, it executes during HTML parse — before any effect can run. */}
      <script
        id="ga-init"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${GA_ID}', { anonymize_ip: true, send_page_view: false });
          `,
        }}
      />
      {/* The library can load late — anything fired before it arrives waits in
          the dataLayer queue and is processed on init. */}
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
      <ClickTracker />
    </>
  );
}
