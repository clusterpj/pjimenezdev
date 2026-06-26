"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Badge } from "@/components/core/Badge";
import { AIStateIndicator } from "@/components/ai/AIStateIndicator";
import { useConcierge } from "@/lib/concierge-context";

const links = [
  { label: "Work",    href: "#work" },
  { label: "About",   href: "#contact" },
  { label: "Contact", href: "#contact" },
];

function LangToggle() {
  const [lang, setLang] = React.useState<"EN" | "ES">("EN");
  return (
    <div role="group" aria-label="Language" style={{
      display: "inline-flex", alignItems: "center", gap: "2px", padding: "3px",
      border: "1px solid var(--border)", borderRadius: "var(--radius-full)",
      background: "var(--bg-surface)",
    }}>
      {(["EN", "ES"] as const).map(l => (
        <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l} style={{
          fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".05em",
          cursor: "pointer", padding: "5px 11px", borderRadius: "var(--radius-full)",
          border: "none",
          background: lang === l ? "var(--accent-subtle)" : "transparent",
          color: lang === l ? "var(--accent)" : "var(--text-muted)",
          transition: "all var(--duration-fast) var(--ease-default)",
        }}>{l}</button>
      ))}
    </div>
  );
}

export function Nav() {
  const reduced = useReducedMotion();
  const [scrolled, setScrolled] = React.useState(false);
  const [active, setActive] = React.useState("");
  const { open, isOpen } = useConcierge();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: reduced ? 0 : -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 48px",
        height: "64px",
        background: scrolled ? "rgba(8,8,15,.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        transition: "background var(--duration-default) var(--ease-default), border-color var(--duration-default) var(--ease-default), backdrop-filter var(--duration-default) var(--ease-default)",
      }}>
      <a
        href="#"
        style={{
          background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "none",
          fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 700,
          color: "var(--text-display)", letterSpacing: "-0.02em",
        }}
      >
        pedro<span style={{ color: "var(--accent)" }}>.</span>j
      </a>

      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
        {links.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            onClick={() => setActive(label)}
            style={{
              background: "none", border: "none", cursor: "pointer", textDecoration: "none",
              fontFamily: "var(--font-body)", fontSize: "14px",
              color: active === label ? "var(--text-display)" : "var(--text-muted)",
              padding: "8px 14px",
              borderRadius: "var(--radius-sm)",
              borderBottom: active === label ? "1px solid var(--accent)" : "1px solid transparent",
              transition: "color var(--duration-fast) var(--ease-default)",
            }}
          >
            {label}
          </a>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Badge variant="accent" dot>Available</Badge>
        <LangToggle />
        <button
          onClick={() => open()}
          aria-label="Open concierge"
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "transparent", border: "none", cursor: "pointer", padding: "8px 6px",
            fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".04em",
            color: isOpen ? "var(--text-display)" : "var(--text-muted)",
            transition: "color var(--duration-fast) var(--ease-default)",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--text-display)")}
          onMouseLeave={e => (e.currentTarget.style.color = isOpen ? "var(--text-display)" : "var(--text-muted)")}
        >
          <span style={{ color: isOpen ? "var(--accent)" : "var(--text-muted)", transition: "color var(--duration-fast) var(--ease-default)" }}>
            {"// ask"}
          </span>
          <AIStateIndicator state={isOpen ? "listening" : "idle"} size="sm" />
        </button>
        <a
          href="#contact"
          style={{
            background: "var(--accent)", color: "#08080F",
            border: "none", cursor: "pointer", textDecoration: "none",
            fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 600,
            padding: "9px 20px", borderRadius: "var(--radius-md)",
            transition: "filter var(--duration-fast) var(--ease-default)",
            display: "inline-block",
          }}
          onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.1)")}
          onMouseLeave={e => (e.currentTarget.style.filter = "")}
        >
          Start a project
        </a>
      </div>
    </motion.nav>
  );
}
