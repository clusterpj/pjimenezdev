"use client";

import React from "react";

export type AIState = "idle" | "listening" | "processing" | "responding";
type Size = "sm" | "md" | "lg";

interface AIStateIndicatorProps {
  state?: AIState;
  size?: Size;
  showLabel?: boolean;
  style?: React.CSSProperties;
}

const stateStyles: Record<AIState, { color: string; glow: string }> = {
  idle:       { color: "var(--text-muted)",    glow: "none" },
  listening:  { color: "var(--ai-listening)",  glow: "0 0 16px var(--ai-listening-glow)" },
  processing: { color: "var(--ai-processing)", glow: "0 0 20px var(--ai-processing-glow)" },
  responding: { color: "var(--ai-responding)", glow: "0 0 16px var(--ai-responding-glow)" },
};

const sizeMap: Record<Size, number> = { sm: 10, md: 14, lg: 20 };

export function AIStateIndicator({ state = "idle", size = "md", showLabel = false, style }: AIStateIndicatorProps) {
  const s = stateStyles[state];
  const d = sizeMap[size];
  const isAnimated = state !== "idle";

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", ...style }}>
      <span style={{
        width: d, height: d, borderRadius: "50%",
        background: s.color, boxShadow: s.glow,
        flexShrink: 0,
        animation: isAnimated ? "ai-breathe var(--duration-ai) var(--ease-default) infinite" : "none",
        display: "inline-block",
      }} />
      {showLabel && state !== "idle" && (
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: "11px",
          textTransform: "uppercase", letterSpacing: "0.07em",
          color: s.color,
        }}>
          {state}
        </span>
      )}
    </span>
  );
}
