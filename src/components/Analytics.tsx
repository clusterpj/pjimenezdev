"use client";

import React, { Suspense } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { GA_ID, pageview } from "@/lib/gtag";

/** Fires a pageview on every client-side route change (App Router
 *  navigations don't trigger a full page load, so gtag's own automatic
 *  pageview on script load only covers the first hit). Split out so the
 *  useSearchParams() call doesn't force the whole tree into a Suspense
 *  boundary at the call site. */
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

/** Loads gtag.js. No-ops entirely if NEXT_PUBLIC_GA_ID isn't set. */
export function Analytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true, send_page_view: false });
          window.gtag = gtag;
        `}
      </Script>
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
    </>
  );
}
