"use client";

import React from "react";

type BadgeVariant = "accent" | "ai" | "success" | "danger" | "neutral";

interface BadgeProps {
  variant?: BadgeVariant;
  dot?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const variantMap: Record<BadgeVariant, React.CSSProperties> = {
  accent:  { background: "var(--accent-subtle)",       color: "var(--accent)",       border: "1px solid rgba(255,178,62,.25)" },
  ai:      { background: "var(--ai-processing-glow)",  color: "var(--ai-responding)", border: "1px solid rgba(155,107,255,.30)" },
  success: { background: "var(--success-subtle)",      color: "var(--success)",      border: "1px solid rgba(74,222,154,.25)" },
  danger:  { background: "var(--danger-subtle)",       color: "var(--danger)",       border: "1px solid rgba(255,107,107,.25)" },
  neutral: { background: "var(--bg-surface)",          color: "var(--text-muted)",   border: "1px solid var(--border)" },
};

export function Badge({ variant = "neutral", dot = false, children, style }: BadgeProps) {
  const v = variantMap[variant];

  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "5px",
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      fontWeight: 500,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      lineHeight: 1,
      padding: "4px 9px",
      borderRadius: "var(--radius-full)",
      ...v,
      ...style,
    }}>
      {dot && (
        <span style={{
          width: "6px", height: "6px", borderRadius: "50%",
          background: "currentColor", display: "inline-block", flexShrink: 0,
        }} />
      )}
      {children}
    </span>
  );
}
