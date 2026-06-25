"use client";

import { Nav } from "@/components/layout/Nav";
import { Hero } from "@/components/sections/Hero";
import { Work } from "@/components/sections/Work";
import { Contact } from "@/components/sections/Contact";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <Nav />
      <main>
        <Hero />
        <Work />
        <Contact />
      </main>
    </motion.div>
  );
}
