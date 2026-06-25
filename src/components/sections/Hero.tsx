"use client";

import React from "react";
import { Button } from "@/components/core/Button";
import { AIStateIndicator, type AIState } from "@/components/ai/AIStateIndicator";
import { ConciergeSurface, type Message } from "@/components/ai/ConciergeSurface";

const REPLIES = [
  "Pedro builds AI integrations, automations, and web apps — shipped, not demoed. Want to scope a project?",
  "That's right in Pedro's lane. What's the timeline and stack you're working with?",
  "Send the details over and Pedro will get back to you within 24 hours.",
];
let replyIndex = 0;

export function Hero() {
  const [aiState, setAiState] = React.useState<AIState>("idle");
  const [msgs, setMsgs] = React.useState<Message[]>([]);

  const handleSend = (text: string) => {
    setMsgs(m => [...m, { role: "user", content: text }]);
    setAiState("processing");
    setTimeout(() => {
      setAiState("responding");
      setMsgs(m => [...m, { role: "ai", content: REPLIES[replyIndex % REPLIES.length] }]);
      replyIndex++;
      setTimeout(() => setAiState("idle"), 1800);
    }, 1400);
  };

  return (
    <section id="home" style={{
      minHeight: "100vh",
      background: "var(--bg-base)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: "64px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Ambient AI glow */}
      <div style={{
        position: "absolute", bottom: "-80px", left: "50%", transform: "translateX(-50%)",
        width: "700px", height: "400px",
        background: "radial-gradient(ellipse at center, rgba(155,107,255,.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      {/* Accent glow top-right */}
      <div style={{
        position: "absolute", top: "10%", right: "5%",
        width: "400px", height: "400px",
        background: "radial-gradient(ellipse at center, rgba(255,178,62,.04) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: 0, maxWidth: "780px", width: "100%", padding: "0 32px",
        textAlign: "center",
        position: "relative", zIndex: 1,
      }}>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: "12px",
          color: "var(--accent)", textTransform: "uppercase",
          letterSpacing: "0.1em", marginBottom: "24px",
        }}>
          // full-stack · AI · Santiago, DO
        </div>

        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(40px, 6vw, 72px)",
          fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em",
          color: "var(--text-display)", margin: "0 0 24px",
        }}>
          I build the AI layer<br />
          <span style={{ color: "var(--accent)" }}>your product is missing.</span>
        </h1>

        <p style={{
          fontFamily: "var(--font-body)", fontSize: "18px", lineHeight: 1.6,
          color: "var(--text-body)", margin: "0 0 40px", maxWidth: "560px",
        }}>
          Solo developer. Fast delivery. AI integrations, automations, web &amp; mobile apps — shipped, not demoed.
        </p>

        <div style={{ display: "flex", gap: "12px", marginBottom: "64px" }}>
          <Button variant="primary" size="lg" onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}>
            Start a project
          </Button>
          <Button variant="ghost" size="lg" onClick={() => document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" })}>
            See the work
          </Button>
        </div>

        <div style={{ width: "100%", maxWidth: "640px" }}>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: "11px",
            color: aiState === "idle" ? "var(--text-muted)" : "var(--ai-responding)",
            textTransform: "uppercase", letterSpacing: ".07em",
            marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px",
          }}>
            <AIStateIndicator state={aiState} size="sm" />
            {aiState === "idle" ? "pedro.ai" : aiState}
          </div>
          <ConciergeSurface
            state={aiState}
            messages={msgs}
            onSend={handleSend}
            placeholder="Ask me what Pedro can build for you."
          />
        </div>
      </div>
    </section>
  );
}
