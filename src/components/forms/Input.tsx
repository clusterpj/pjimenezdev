"use client";

import React from "react";

interface InputProps {
  label?: string;
  hint?: string;
  error?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  type?: string;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}

export function Input({ label, hint, error, placeholder, value, onChange, disabled = false, type = "text", icon, style }: InputProps) {
  const [focused, setFocused] = React.useState(false);

  const borderColor = error
    ? "rgba(255,107,107,.45)"
    : focused ? "var(--border-accent)" : "var(--border)";

  const boxShadow = error
    ? "0 0 0 3px var(--danger-glow)"
    : focused ? "0 0 0 3px var(--accent-glow)" : "none";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", ...style }}>
      {label && (
        <label style={{
          fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 500,
          color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em",
        }}>
          {label}
        </label>
      )}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {icon && (
          <span style={{ position: "absolute", left: "12px", color: "var(--text-muted)", display: "flex", alignItems: "center", pointerEvents: "none" }}>
            {icon}
          </span>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            fontFamily: "var(--font-body)", fontSize: "15px", fontWeight: 400,
            color: "var(--text-display)",
            background: "var(--bg-surface)",
            border: `1px solid ${borderColor}`,
            borderRadius: "var(--radius-sm)",
            padding: icon ? "11px 14px 11px 38px" : "11px 14px",
            outline: "none", boxSizing: "border-box", boxShadow,
            transition: "border-color var(--duration-fast) var(--ease-default), box-shadow var(--duration-fast) var(--ease-default)",
            opacity: disabled ? 0.45 : 1,
            cursor: disabled ? "not-allowed" : "text",
          }}
        />
      </div>
      {(hint || error) && (
        <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: error ? "var(--danger)" : "var(--text-muted)" }}>
          {error || hint}
        </span>
      )}
    </div>
  );
}
