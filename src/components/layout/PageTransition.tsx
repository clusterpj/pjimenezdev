"use client";
import { AnimatePresence } from "framer-motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  return <AnimatePresence mode="wait">{children}</AnimatePresence>;
}
