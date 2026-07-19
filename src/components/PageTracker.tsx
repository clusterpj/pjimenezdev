"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { trackPage } from "@/lib/session";

/** Mount in the root layout — records every page visit so the concierge
 *  knows what the visitor has already seen. */
export function PageTracker() {
  const pathname = usePathname();
  React.useEffect(() => { trackPage(pathname); }, [pathname]);

  // For the devs who open the console — of course you did.
  React.useEffect(() => {
    console.log(
      "%c▲ pedrojimenez.dev %c\n\nYou opened the console — I like you already.\nThis site is Next.js 15 on Cloudflare Workers, and the concierge is real.\nTry the Konami code on the home page. Then email hello@pedrojimenez.dev.",
      "font:700 16px 'Space Grotesk',sans-serif;color:#FFB23E",
      "font:400 12px monospace;color:#9B6BFF",
    );
  }, []);
  return null;
}
