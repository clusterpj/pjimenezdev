"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { trackPage } from "@/lib/session";

/** Mount in the root layout — records every page visit so the concierge
 *  knows what the visitor has already seen. */
export function PageTracker() {
  const pathname = usePathname();
  React.useEffect(() => { trackPage(pathname); }, [pathname]);
  return null;
}
