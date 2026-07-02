"use client";

import React from "react";
import Link from "next/link";
import { type Lang, getDict, langPrefix, projects } from "@/lib/content";

const FILTER_KEYS = ["AI", "Web", "Mobile", "SaaS", "Automation"] as const;

export function WorkGrid({ lang }: { lang: Lang }) {
  const t = getDict(lang).work;
  const pre = langPrefix(lang);
  const all = projects[lang];
  const [filter, setFilter] = React.useState<string>("All");

  const visible = filter === "All" ? all : all.filter((p) => p.cats.includes(filter));
  const filters = [
    { key: "All", label: `${t.all} · ${all.length}` },
    ...FILTER_KEYS.map((key) => ({ key: key as string, label: t.filters[key] })),
  ];

  return (
    <>
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px,5vw,48px) 28px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }} role="group" aria-label={t.filterLabel}>
          {filters.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                style={{
                  font: "500 13px var(--font-mono), monospace",
                  color: active ? "#08080F" : "var(--text-body)",
                  background: active ? "var(--accent)" : "rgba(255,255,255,.03)",
                  border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
                  borderRadius: "var(--radius-md)", padding: "10px 18px",
                  cursor: "pointer", letterSpacing: ".02em", minHeight: 44,
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </section>

      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px,5vw,48px) clamp(64px,9vw,110px)" }}>
        <div className="grid-work">
          {visible.map((p) => (
            <Link key={p.id} data-card href={`${pre}/work/${p.id}`} style={{
              display: "flex", flexDirection: "column", background: "var(--bg-surface)",
              border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-md)", padding: 24, textDecoration: "none",
              scrollMarginTop: 90,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14, marginBottom: 6 }}>
                <h2 style={{ font: "600 21px var(--font-display), sans-serif", letterSpacing: "-.01em", color: "#fff", margin: 0 }}>{p.name}</h2>
                <span style={{ font: "500 11px var(--font-mono), monospace", color: "var(--text-muted)", letterSpacing: ".06em", flexShrink: 0, paddingTop: 4 }}>{p.year}</span>
              </div>
              <div style={{
                font: "500 11px var(--font-mono), monospace", color: "var(--accent)",
                textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 12,
              }}>
                {p.category}
              </div>
              <p style={{ font: "400 14px/1.65 var(--font-body), sans-serif", color: "var(--text-body)", margin: "0 0 18px", flex: 1 }}>{p.desc}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 16 }}>
                {p.tags.map((tag) => (
                  <span key={tag} style={{
                    font: "500 11px var(--font-mono), monospace", color: "var(--text-muted)",
                    background: "rgba(255,255,255,.03)", border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)", padding: "4px 9px",
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
              <span style={{ font: "600 13px var(--font-body), sans-serif", color: "var(--accent)", display: "inline-flex", alignItems: "center", gap: 6 }}>
                {t.readCaseStudy} <span style={{ fontFamily: "var(--font-mono)" }}>→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
