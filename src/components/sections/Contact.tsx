"use client";

import React from "react";
import { Tag } from "@/components/core/Tag";
import { AIStateIndicator, type AIState } from "@/components/ai/AIStateIndicator";
import { ConciergeSurface, type Message } from "@/components/ai/ConciergeSurface";
import { streamConcierge } from "@/lib/streamConcierge";
import { motion, useReducedMotion } from "framer-motion";

const SKILLS = ["AI integrations", "Automations", "Web apps", "Mobile apps", "3D / Motion", "LangChain", "Next.js", "Python", "n8n", "Blender"];

export function Contact() {
  const reduced = useReducedMotion();
  const [aiState, setAiState] = React.useState<AIState>("idle");
  const [msgs, setMsgs] = React.useState<Message[]>([
    { role: "ai", content: "Hola. Tell me what you're building — I'll tell you what Pedro can do for you and whether he's available." },
  ]);

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
    <section id="contact" style={{
      minHeight: "100vh",
      background: "var(--bg-base)",
      paddingTop: "64px",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 480px",
        gap: "80px",
        maxWidth: "1100px",
        width: "100%",
        padding: "72px 48px",
        alignItems: "start",
      }}>
        {/* Left — bio */}
        <motion.div
          initial={{ opacity: 0, x: reduced ? 0 : -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: "11px",
            color: "var(--text-muted)", textTransform: "uppercase",
            letterSpacing: ".1em", marginBottom: "20px",
          }}>
            {"// about"}
          </div>

          <h2 style={{
            fontFamily: "var(--font-display)", fontSize: "42px", fontWeight: 700,
            letterSpacing: "-0.03em", color: "var(--text-display)",
            margin: "0 0 24px", lineHeight: 1.1,
          }}>
            Pedro Jimenez.<br />
            <span style={{ color: "var(--text-muted)", fontWeight: 400, fontSize: "32px" }}>Solo developer.</span>
          </h2>

          <p style={{
            fontFamily: "var(--font-body)", fontSize: "16px", lineHeight: 1.7,
            color: "var(--text-body)", margin: "0 0 24px", maxWidth: "420px",
          }}>
            Based in Santiago, Dominican Republic. I ship AI integrations, automations, and full-stack apps — fast, production-grade, without the agency overhead.
          </p>

          <p style={{
            fontFamily: "var(--font-body)", fontSize: "16px", lineHeight: 1.7,
            color: "var(--text-body)", margin: "0 0 40px", maxWidth: "420px",
          }}>
            If you need a smart layer between your data and your users, that&apos;s what I build.
          </p>

          <div style={{
            fontFamily: "var(--font-mono)", fontSize: "11px",
            color: "var(--text-muted)", textTransform: "uppercase",
            letterSpacing: ".08em", marginBottom: "14px",
          }}>
            Stack &amp; services
          </div>
          <motion.div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {SKILLS.map((s, index) => (
              <motion.div
                key={s}
                initial={{ opacity: 0, y: reduced ? 0 : 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
              >
                <Tag>{s}</Tag>
              </motion.div>
            ))}
          </motion.div>

          <div style={{
            marginTop: "40px", padding: "20px 24px",
            background: "var(--bg-surface)",
            border: "1px solid var(--border-accent)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-accent)",
            display: "flex", alignItems: "center", gap: "14px",
          }}>
            <AIStateIndicator state="idle" size="lg" />
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--accent)", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: "4px" }}>
                Available for projects
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--text-body)" }}>
                Open from July 2026. Replying within 24 h.
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right — Concierge */}
        <motion.div
          initial={{ opacity: 0, x: reduced ? 0 : 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: "11px",
            display: "flex", alignItems: "center", gap: "8px",
            color: aiState === "idle" ? "var(--text-muted)" : "var(--ai-responding)",
            textTransform: "uppercase", letterSpacing: ".07em",
            marginBottom: "12px",
          }}>
            <AIStateIndicator state={aiState} size="sm" />
            pedro.ai
          </div>
          <ConciergeSurface
            state={aiState}
            messages={msgs}
            onSend={handleSend}
            placeholder="Tell me what you're building…"
          />
        </motion.div>
      </div>
    </section>
  );
}
