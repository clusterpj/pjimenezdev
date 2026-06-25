"use client";

import React from "react";

interface SelectOption { value: string; label: string; }

interface SelectProps {
  label?: string;
  options?: (string | SelectOption)[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  hint?: string;
  style?: React.CSSProperties;
}

export function Select({ label, options = [], value, onChange, disabled = false, hint, style }: SelectProps) {
  const [focused, setFocused] = React.useState(false);

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
      <div style={{ position: "relative" }}>
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            fontFamily: "var(--font-body)", fontSize: "15px",
            color: "var(--text-display)",
            background: "var(--bg-surface)",
            border: `1px solid ${focused ? "var(--border-accent)" : "var(--border)"}`,
            borderRadius: "var(--radius-sm)",
            padding: "11px 36px 11px 14px",
            outline: "none", boxSizing: "border-box",
            boxShadow: focused ? "0 0 0 3px var(--accent-glow)" : "none",
            appearance: "none",
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.45 : 1,
            transition: "border-color var(--duration-fast) var(--ease-default), box-shadow var(--duration-fast) var(--ease-default)",
          }}
        >
          {options.map((opt) => {
            const isObj = typeof opt === "object";
            const val = isObj ? opt.value : opt;
            const lbl = isObj ? opt.label : opt;
            return <option key={val} value={val}>{lbl}</option>;
          })}
        </select>
        <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-muted)", fontSize: "12px" }}>
          ▾
        </span>
      </div>
      {hint && (
        <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--text-muted)" }}>{hint}</span>
      )}
    </div>
  );
}
