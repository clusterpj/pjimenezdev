"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  type?: "button" | "submit" | "reset";
}

const sizeTokens: Record<Size, React.CSSProperties & { gap: string; iconSize: string }> = {
  sm: { fontSize: "13px", padding: "8px 16px",  gap: "6px", iconSize: "14px", borderRadius: "var(--radius-md)" },
  md: { fontSize: "15px", padding: "11px 22px", gap: "8px", iconSize: "16px", borderRadius: "var(--radius-md)" },
  lg: { fontSize: "17px", padding: "14px 28px", gap: "10px", iconSize: "18px", borderRadius: "var(--radius-md)" },
};

const variantBase: Record<Variant, React.CSSProperties> = {
  primary:   { background: "var(--accent)",        color: "#08080F",             border: "1px solid transparent",                fontWeight: 600 },
  secondary: { background: "var(--bg-surface)",    color: "var(--text-display)", border: "1px solid var(--border-accent)",       fontWeight: 500 },
  ghost:     { background: "transparent",           color: "var(--text-body)",    border: "1px solid var(--border)",              fontWeight: 500 },
  danger:    { background: "var(--danger-subtle)",  color: "var(--danger)",       border: "1px solid rgba(255,107,107,.30)",      fontWeight: 500 },
};

const variantHover: Record<Variant, React.CSSProperties> = {
  primary:   { boxShadow: "var(--shadow-accent)", filter: "brightness(1.08)" },
  secondary: { background: "var(--bg-surface-hover)", boxShadow: "var(--shadow-accent)" },
  ghost:     { background: "var(--bg-surface)", border: "1px solid var(--border-accent)", color: "var(--text-display)" },
  danger:    { background: "var(--danger-subtle)", boxShadow: "0 0 20px var(--danger-glow)" },
};

export function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  icon,
  children,
  style,
  type = "button",
}: ButtonProps) {
  const reduced = useReducedMotion();
  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);

  const s = sizeTokens[size];
  const v = variantBase[variant];
  const h = variantHover[variant];

  const computed: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: s.gap,
    fontFamily: "var(--font-body)",
    fontSize: s.fontSize,
    fontWeight: v.fontWeight,
    padding: s.padding as string,
    borderRadius: s.borderRadius as string,
    border: v.border as string,
    background: v.background as string,
    color: v.color as string,
    cursor: disabled || loading ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    transition: "all var(--duration-fast) var(--ease-default)",
    outline: "none",
    letterSpacing: 0,
    whiteSpace: "nowrap",
    ...(hovered && !disabled ? h : {}),
    ...style,
  };

  return (
    <motion.button
      type={type}
      style={computed}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      whileHover={{ scale: reduced ? 1 : 1.02 }}
      whileTap={{ scale: reduced ? 1 : 0.97 }}
      transition={{ duration: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
    >
      {loading ? (
        <span style={{
          width: "14px", height: "14px", borderRadius: "50%",
          border: "2px solid currentColor", borderTopColor: "transparent",
          animation: "btn-spin .6s linear infinite", display: "inline-block",
        }} />
      ) : icon ? (
        <span style={{ width: s.iconSize, height: s.iconSize, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {icon}
        </span>
      ) : null}
      {children}
    </motion.button>
  );
}
