"use client";

import React from "react";
import { Button } from "@/components/core/Button";
import { AIStateIndicator, type AIState } from "@/components/ai/AIStateIndicator";
import { ConciergeSurface, type Message } from "@/components/ai/ConciergeSurface";
import { streamConcierge } from "@/lib/streamConcierge";
import { motion, useReducedMotion } from "framer-motion";
import { useConcierge } from "@/lib/concierge-context";

export function Hero() {
  const reduced = useReducedMotion();

  const fadeUp = (delay: number, y = 20) => ({
    initial: { opacity: 0, y: reduced ? 0 : y },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  });

  const { open } = useConcierge();
  const [aiState, setAiState] = React.useState<AIState>("idle");
  const [msgs, setMsgs] = React.useState<Message[]>([]);

  const handleSend = async (text: string) => {
    const userMsg: Message = { role: "user", content: text };
    const thread = [...msgs, userMsg];
    setMsgs(thread);
    setAiState("processing");

    let isFirst = true;
    try {
      await streamConcierge(thread, (token) => {
        if (isFirst) {
          isFirst = false;
          setAiState("responding");
          setMsgs(m => [...m, { role: "ai", content: token }]);
        } else {
          setMsgs(m => {
            const next = [...m];
            next[next.length - 1] = { role: "ai", content: next[next.length - 1].content + token };
            return next;
          });
        }
      });
    } catch {
      setMsgs(m => [...m, { role: "ai", content: "Connection hiccup — try again." }]);
    } finally {
      setAiState("idle");
    }
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
        <motion.div {...fadeUp(0, 12)} style={{
          fontFamily: "var(--font-mono)", fontSize: "12px",
          color: "var(--accent)", textTransform: "uppercase",
          letterSpacing: "0.1em", marginBottom: "24px",
        }}>
          {"// full-stack · AI · Santiago, DO"}
        </motion.div>

        <motion.h1 {...fadeUp(100, 20)} style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(40px, 6vw, 72px)",
          fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em",
          color: "var(--text-display)", margin: "0 0 24px",
        }}>
          I build the AI layer<br />
          <span style={{ color: "var(--accent)" }}>your product is missing.</span>
        </motion.h1>

        <motion.p {...fadeUp(200, 16)} style={{
          fontFamily: "var(--font-body)", fontSize: "18px", lineHeight: 1.6,
          color: "var(--text-body)", margin: "0 0 40px", maxWidth: "560px",
        }}>
          Solo developer. Fast delivery. AI integrations, automations, web &amp; mobile apps — shipped, not demoed.
        </motion.p>

        <motion.div {...fadeUp(300, 12)} style={{ display: "flex", gap: "12px", marginBottom: "64px" }}>
          <Button variant="primary" size="lg" onClick={() => open()}>
            Start a project
          </Button>
          <Button variant="ghost" size="lg" onClick={() => document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" })}>
            See the work
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: reduced ? 1 : 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          style={{ width: "100%", maxWidth: "640px" }}
        >
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
        </motion.div>
      </div>
    </section>
  );
}
