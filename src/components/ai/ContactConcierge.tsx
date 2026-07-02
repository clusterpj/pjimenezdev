"use client";

import React from "react";
import { type Lang, getDict } from "@/lib/content";
import { ConciergeSurface, useConciergeChat } from "@/components/ai/ConciergeSurface";

/** Contact-page concierge: scoping greeting + a state label with breathing dot above the surface. */
export function ContactConcierge({ lang }: { lang: Lang }) {
  const t = getDict(lang).about;
  const chat = useConciergeChat("contact", lang, t.conciergeGreeting);
  const st = chat.aiState;

  const stateLabel =
    st === "idle" ? t.stateOnline : st === "processing" ? t.stateProcessing : t.stateResponding;
  const dotColor = st === "responding" ? "var(--ai-responding)" : "var(--ai-processing)";
  const dotGlow =
    st === "idle" ? "0 0 14px var(--ai-processing)"
    : st === "processing" ? "0 0 14px var(--ai-processing-glow)"
    : "0 0 12px var(--ai-responding-glow)";

  return (
    <div>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 9,
        font: "500 11px var(--font-mono), monospace",
        color: st === "idle" ? "var(--text-muted)" : "var(--ai-responding)",
        textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12,
      }}>
        <span style={{
          width: 9, height: 9, borderRadius: "50%", background: dotColor, boxShadow: dotGlow,
          animation: "ai-breathe 2.4s var(--ease-default) infinite",
        }} />
        pedro.ai · {stateLabel}
      </div>
      <ConciergeSurface chat={chat} lang={lang} mode="contact" placeholder={t.conciergePlaceholder} maxThreadHeight={320} />
    </div>
  );
}
