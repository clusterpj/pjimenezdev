"use client";

import React from "react";

interface CardProps {
  accent?: boolean;
  ai?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  padding?: string | number;
}

export function Card({ accent = false, ai = false, onClick, children, style, padding }: CardProps) {
  const [hovered, setHovered] = React.useState(false);
  const interactive = Boolean(onClick);

  const borderColor = ai
    ? "rgba(155,107,255,.35)"
    : accent || (interactive && hovered)
    ? "var(--border-accent)"
    : "var(--border)";

  const glow = ai
    ? "0 0 32px var(--ai-processing-glow)"
    : accent || (interactive && hovered)
    ? "var(--shadow-accent)"
    : "var(--shadow-md)";

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered && interactive ? "var(--bg-surface-hover)" : "var(--bg-surface)",
        border: `1px solid ${borderColor}`,
        borderRadius: "var(--radius-lg)",
        boxShadow: glow,
        padding: padding ?? "24px",
        transition: "all var(--duration-fast) var(--ease-default)",
        cursor: interactive ? "pointer" : "default",
        transform: interactive && hovered ? "translateY(-1px)" : "translateY(0)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
