"use client";

import React from "react";
import { type Lang, getDict } from "@/lib/content";
import { ConciergeSurface, useConciergeChat } from "@/components/ai/ConciergeSurface";

const dust = [
  { left: "30%", bottom: 120, size: 4, color: "var(--ai-listening)", anim: "dvfloat 7s linear infinite" },
  { left: "56%", bottom: 90, size: 3, color: "var(--ai-processing)", anim: "dvfloat 9s 1s linear infinite" },
  { left: "70%", bottom: 150, size: 5, color: "var(--ai-responding)", anim: "dvfloat 8s 2s linear infinite" },
];

export function HomeHero({ lang }: { lang: Lang }) {
  const t = getDict(lang).home;
  const chat = useConciergeChat("home", lang);

  return (
    <section style={{
      position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "96px clamp(20px,5vw,48px) 64px", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 62% 52% at 50% 40%, rgba(155,107,255,.11) 0%, transparent 66%)",
      }} />
      {dust.map((p, i) => (
        <div key={i} style={{
          position: "absolute", left: p.left, bottom: p.bottom, width: p.size, height: p.size,
          borderRadius: "50%", background: p.color, boxShadow: `0 0 8px ${p.color}`,
          animation: p.anim, pointerEvents: "none",
        }} />
      ))}

      <div style={{
        position: "relative", zIndex: 1, width: "100%", maxWidth: 760,
        display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 9,
          font: "500 12px var(--font-mono), monospace", color: "var(--ai-responding)",
          textTransform: "uppercase", letterSpacing: ".14em", marginBottom: 22,
        }}>
          <span style={{
            width: 9, height: 9, borderRadius: "50%", background: "var(--ai-processing)",
            boxShadow: "0 0 14px var(--ai-processing)",
            animation: "ai-breathe 2.4s var(--ease-default) infinite",
          }} />
          {t.heroBadge}
        </div>

        <h1 style={{
          fontFamily: "var(--font-display), sans-serif", fontWeight: 700,
          fontSize: "clamp(38px,7vw,68px)", lineHeight: 1.04, letterSpacing: "-.03em",
          color: "#fff", margin: "0 0 18px",
        }}>
          {t.heroTitle1}<br /><span style={{ color: "var(--accent)" }}>{t.heroTitle2}</span>
        </h1>
        <p style={{
          font: "400 clamp(15px,2.2vw,18px)/1.6 var(--font-body), sans-serif",
          color: "var(--text-body)", margin: "0 0 30px", maxWidth: 520,
        }}>
          {t.heroSub}
        </p>

        <div style={{ width: "100%", maxWidth: 660 }}>
          <ConciergeSurface chat={chat} lang={lang} mode="home" placeholder={t.conciergePlaceholder} maxThreadHeight={300} />
        </div>

        <div style={{ width: "100%", maxWidth: 660, marginTop: 22 }}>
          <div style={{
            font: "500 11px var(--font-mono), monospace", color: "var(--text-muted)",
            textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12,
          }}>
            {t.tryAsking}
          </div>
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))" }}>
            {t.chips.map((chip) => (
              <button key={chip} className="chip-btn" onClick={() => chat.ask(chip)}>
                <span data-arrow>›</span>
                {chip}
              </button>
            ))}
          </div>
        </div>

        <a href="#work" style={{
          marginTop: 44, display: "inline-flex", flexDirection: "column", alignItems: "center",
          gap: 8, color: "var(--text-muted)", textDecoration: "none",
          font: "500 11px var(--font-mono), monospace", textTransform: "uppercase", letterSpacing: ".1em",
        }}>
          {t.scrollToBrowse}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </a>
      </div>
    </section>
  );
}

/** "Or ask the site ↑" — scrolls to the hero concierge and focuses its input. */
export function AskSiteButton({ label }: { label: string }) {
  return (
    <button
      className="cta-ghost"
      style={{ padding: "14px 26px", fontSize: 16 }}
      onClick={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => {
          document.querySelector<HTMLInputElement>(".cc-input")?.focus({ preventScroll: true });
        }, 500);
      }}
    >
      {label}
    </button>
  );
}
