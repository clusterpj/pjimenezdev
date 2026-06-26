"use client";

import React from "react";
import { Card } from "@/components/core/Card";
import { Tag } from "@/components/core/Tag";
import { Badge } from "@/components/core/Badge";
import { Button } from "@/components/core/Button";
import { motion, useReducedMotion } from "framer-motion";

const PROJECTS = [
  {
    id: 1,
    name: "BotForge",
    desc: "AI customer support platform on WhatsApp for SMBs. Dental clinic build adds clinical notes, appointment scheduling, and RAG over patient records.",
    tags: ["AI integration", "SaaS"],
    stack: ["Node.js", "DeepSeek", "RAG", "WhatsApp API"],
    result: "↑ Live with 3 paying SMB clients",
    grad: "linear-gradient(145deg, #0e0a1e, #16103a)",
    label: "// ai + saas",
    year: "2026",
    accent: true,
  },
  {
    id: 2,
    name: "C21 Perdomo",
    desc: "Multilingual real-estate site for Century 21 Dominican Republic — 4-locale routing, Meta conversion API, and GA4 analytics pipeline.",
    tags: ["Web app", "Real estate"],
    stack: ["Next.js", "WordPress", "Meta CAP", "GA4"],
    result: "↑ 4-locale platform, live in production",
    grad: "linear-gradient(145deg, #08112a, #0d1a40)",
    label: "// web app",
    year: "2026",
    accent: false,
  },
  {
    id: 3,
    name: "Cabarete Villas",
    desc: "Vacation rental platform with iCal sync across booking channels, PayPal checkout flow, and AI-powered listing translations.",
    tags: ["Web app", "E-commerce"],
    stack: ["Next.js", "Firebase", "PayPal"],
    result: "↑ Full booking flow, live",
    grad: "linear-gradient(145deg, #081c1c, #0d2a2a)",
    label: "// web app",
    year: "2025",
    accent: false,
  },
  {
    id: 4,
    name: "MoneyGuard",
    desc: "Overspending prevention app with a 3-gate AI decision engine, OCR receipt scanning, and an offline-first architecture.",
    tags: ["Mobile app", "AI integration"],
    stack: ["Flutter", "FastAPI", "DeepSeek"],
    result: "↑ Offline-first — no connection required",
    grad: "linear-gradient(145deg, #081a0c, #0e2814)",
    label: "// mobile app",
    year: "2025",
    accent: false,
  },
  {
    id: 5,
    name: "LuxeDrive",
    desc: "Multi-tenant car rental SaaS with a full booking flow, fleet management dashboard, and role-based access control.",
    tags: ["SaaS", "Web app"],
    stack: ["Next.js", "MongoDB", "NextAuth"],
    result: "↑ Multi-tenant fleet ops dashboard",
    grad: "linear-gradient(145deg, #1a1208, #281c0e)",
    label: "// saas",
    year: "2024",
    accent: false,
  },
  {
    id: 6,
    name: "Social Command Center",
    desc: "Telegram bot that generates AI copy and images for Instagram, LinkedIn, Facebook, and X — scheduled and posted automatically.",
    tags: ["Automation", "AI integration"],
    stack: ["Bun", "Claude", "fal.ai"],
    result: "↑ 4-platform AI content engine",
    grad: "linear-gradient(145deg, #130c1e, #1e1230)",
    label: "// automation",
    year: "2024",
    accent: false,
  },
  {
    id: 7,
    name: "Ruleta",
    desc: "Prize wheel app for live events — weighted probability engine, admin dashboard, and offline-first local persistence.",
    tags: ["Mobile app"],
    stack: ["Flutter", "Hive"],
    result: "↑ Event-ready, runs fully offline",
    grad: "linear-gradient(145deg, #1a1008, #281808)",
    label: "// mobile app",
    year: "2025",
    accent: false,
  },
  {
    id: 8,
    name: "SEO Blog Generator",
    desc: "End-to-end SEO content pipeline with keyword analysis, readability scoring, and automated publishing.",
    tags: ["AI integration", "Automation"],
    stack: ["Flask", "Python", "Ollama", "spaCy"],
    result: "↑ Keyword-aware content at scale",
    grad: "linear-gradient(145deg, #081a10, #0e2818)",
    label: "// ai + automation",
    year: "2024",
    accent: false,
  },
];

type Project = typeof PROJECTS[number];

function Thumb({ p }: { p: Project }) {
  const patternId = `grid-${p.id}`;
  return (
    <div style={{ position: "relative", aspectRatio: "16 / 9", background: p.grad, overflow: "hidden" }}>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.12 }} aria-hidden>
        <defs>
          <pattern id={patternId} width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M44 0L0 0L0 44" fill="none" stroke="#fff" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
      {p.accent && (
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 70% 20%, var(--accent-glow), transparent 60%)",
        }} />
      )}
      <span style={{
        position: "absolute", left: "18px", bottom: "16px",
        fontFamily: "var(--font-mono)", fontSize: "11px",
        textTransform: "uppercase", letterSpacing: ".08em",
        color: "rgba(255,255,255,.30)",
      }}>{p.label}</span>
    </div>
  );
}

export function Work() {
  const reduced = useReducedMotion();

  return (
    <section id="work" style={{ minHeight: "100vh", background: "var(--bg-base)", paddingTop: "64px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "72px 48px" }}>
        <div style={{ marginBottom: "56px" }}>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: "11px",
            color: "var(--text-muted)", textTransform: "uppercase",
            letterSpacing: ".1em", marginBottom: "16px",
          }}>
            {"// selected work"}
          </div>
          <motion.div
            initial={{ opacity: 0, y: reduced ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 style={{
              fontFamily: "var(--font-display)", fontSize: "48px", fontWeight: 700,
              letterSpacing: "-0.03em", color: "var(--text-display)",
              margin: "0 0 16px",
            }}>
              Built and shipped.
            </h2>
          </motion.div>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "16px",
            color: "var(--text-body)", maxWidth: "480px", margin: 0, lineHeight: 1.65,
          }}>
            A few of the integrations, apps, and systems I&apos;ve shipped — each one solving a real problem.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(460px, 1fr))",
          gap: "20px",
        }}>
          {PROJECTS.map((p, index) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: reduced ? 0 : 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: reduced ? 0 : -4 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              style={{ height: "100%" }}
            >
              <Card
                accent={p.accent}
                onClick={() => {}}
                padding="0"
                style={{ overflow: "hidden", display: "flex", flexDirection: "column", height: "100%" }}
              >
                <Thumb p={p} />
                <div style={{ padding: "20px 24px 22px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <div style={{
                    fontFamily: "var(--font-mono)", fontSize: "12px",
                    color: "var(--accent)", letterSpacing: ".01em", marginBottom: "16px",
                  }}>{p.result}</div>

                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "12px", marginBottom: "10px" }}>
                    <h3 style={{
                      fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 600,
                      color: "var(--text-display)", margin: 0, letterSpacing: "-0.01em",
                    }}>{p.name}</h3>
                    <span style={{
                      fontFamily: "var(--font-mono)", fontSize: "11px",
                      color: "var(--text-muted)", textTransform: "uppercase",
                      letterSpacing: ".06em", flexShrink: 0,
                    }}>{p.year}</span>
                  </div>

                  <p style={{
                    fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.65,
                    color: "var(--text-body)", margin: "0 0 18px",
                  }}>{p.desc}</p>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", marginBottom: "18px" }}>
                    {p.tags.map(t => <Tag key={t} active={p.accent}>{t}</Tag>)}
                  </div>

                  <div style={{
                    marginTop: "auto", paddingTop: "16px",
                    borderTop: "1px solid var(--border)",
                    display: "flex", alignItems: "center", gap: "7px", flexWrap: "wrap",
                  }}>
                    <span style={{
                      fontFamily: "var(--font-mono)", fontSize: "10px",
                      color: "var(--text-muted)", textTransform: "uppercase",
                      letterSpacing: ".07em", marginRight: "2px",
                    }}>stack</span>
                    {p.stack.map(s => <Badge key={s} variant="neutral">{s}</Badge>)}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div style={{ marginTop: "48px", textAlign: "center" }}>
          <Button variant="ghost" onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}>
            Discuss your project
          </Button>
        </div>
      </div>
    </section>
  );
}
