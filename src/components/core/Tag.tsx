"use client";

import React from "react";

interface TagProps {
  active?: boolean;
  onDismiss?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function Tag({ active = false, onDismiss, children, style }: TagProps) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        fontFamily: "var(--font-body)",
        fontSize: "13px",
        fontWeight: 500,
        color: active ? "var(--accent)" : "var(--text-body)",
        background: active ? "var(--accent-subtle)" : "var(--bg-surface)",
        border: active ? "1px solid var(--border-accent)" : "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        padding: "5px 12px",
        lineHeight: 1,
        transition: "all var(--duration-fast) var(--ease-default)",
        ...style,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "0 0 0 2px",
            color: hovered ? "var(--text-display)" : "var(--text-muted)",
            display: "flex", alignItems: "center", lineHeight: 1,
            fontSize: "14px",
            transition: "color var(--duration-fast) var(--ease-default)",
          }}
          aria-label="Remove"
        >
          ×
        </button>
      )}
    </span>
  );
}
