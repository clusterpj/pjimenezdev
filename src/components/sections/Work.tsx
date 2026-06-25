"use client";

import React from "react";
import { Card } from "@/components/core/Card";
import { Tag } from "@/components/core/Tag";
import { Button } from "@/components/core/Button";

const PROJECTS = [
  {
    id: 1,
    name: "Supplier Sync",
    desc: "AI-powered supplier data pipeline for a logistics company. Reduced manual reconciliation from 6 hours to 8 minutes.",
    tags: ["AI integration", "Automation", "Python"],
    year: "2026",
    accent: false,
  },
  {
    id: 2,
    name: "Campo MX",
    desc: "B2B ordering platform for agricultural produce in Mexico. Full-stack: Next.js frontend, Supabase backend, WhatsApp notifications.",
    tags: ["Web app", "Mobile"],
    year: "2025",
    accent: true,
  },
  {
    id: 3,
    name: "Briefbot",
    desc: "Legal document AI that extracts and summarises key clauses. Deployed for a three-attorney firm; handles 200+ briefs/month.",
    tags: ["AI integration", "LangChain", "FastAPI"],
    year: "2025",
    accent: false,
  },
  {
    id: 4,
    name: "Studio 3D Identity",
    desc: "Motion and 3D brand identity system for a digital-first agency — logo animation, looping hero, social kit.",
    tags: ["3D / Motion", "Blender"],
    year: "2024",
    accent: false,
  },
];

export function Work() {
  return (
    <section id="work" style={{ minHeight: "100vh", background: "var(--bg-base)", paddingTop: "64px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "72px 48px" }}>
        <div style={{ marginBottom: "56px" }}>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: "11px",
            color: "var(--text-muted)", textTransform: "uppercase",
            letterSpacing: ".1em", marginBottom: "16px",
          }}>
            // selected work
          </div>
          <h2 style={{
            fontFamily: "var(--font-display)", fontSize: "48px", fontWeight: 700,
            letterSpacing: "-0.03em", color: "var(--text-display)",
            margin: "0 0 16px",
          }}>
            Built and shipped.
          </h2>
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
          {PROJECTS.map(p => (
            <Card key={p.id} accent={p.accent} onClick={() => {}}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <h3 style={{
                  fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 600,
                  color: "var(--text-display)", margin: 0, letterSpacing: "-0.01em",
                }}>
                  {p.name}
                </h3>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: "11px",
                  color: "var(--text-muted)", textTransform: "uppercase",
                  letterSpacing: ".06em", flexShrink: 0, marginLeft: "16px", paddingTop: "4px",
                }}>
                  {p.year}
                </span>
              </div>
              <p style={{
                fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.65,
                color: "var(--text-body)", margin: "0 0 20px",
              }}>
                {p.desc}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {p.tags.map(t => <Tag key={t} active={p.accent}>{t}</Tag>)}
              </div>
            </Card>
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
