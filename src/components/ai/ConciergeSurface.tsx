"use client";

import React from "react";
import { AIStateIndicator, type AIState } from "./AIStateIndicator";

export interface Message { role: "user" | "ai"; content: string; }

interface ConciergeSurfaceProps {
  state?: AIState;
  placeholder?: string;
  messages?: Message[];
  onSend?: (text: string) => void;
  style?: React.CSSProperties;
}

const stateColors: Record<AIState, { border: string; glow: string; dot: string }> = {
  idle:       { border: "var(--border)",              glow: "none",                               dot: "var(--text-muted)" },
  listening:  { border: "rgba(110,139,255,.45)",       glow: "0 0 24px var(--ai-listening-glow)",  dot: "var(--ai-listening)" },
  processing: { border: "rgba(155,107,255,.45)",       glow: "0 0 32px var(--ai-processing-glow)", dot: "var(--ai-processing)" },
  responding: { border: "rgba(200,168,255,.35)",       glow: "0 0 24px var(--ai-responding-glow)", dot: "var(--ai-responding)" },
};

export function ConciergeSurface({
  state = "idle",
  placeholder = "Ask me what Pedro can build for you.",
  messages = [],
  onSend,
  style,
}: ConciergeSurfaceProps) {
  const [input, setInput] = React.useState("");
  const threadRef = React.useRef<HTMLDivElement>(null);
  const s = stateColors[state];
  const isActive = state !== "idle";

  React.useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend?.(input.trim());
    setInput("");
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div style={{
      background: "rgba(16,16,25,.92)",
      backdropFilter: "blur(16px)",
      border: `1px solid ${s.border}`,
      borderRadius: "var(--radius-xl)",
      boxShadow: s.glow,
      overflow: "hidden",
      transition: "border-color var(--duration-default) var(--ease-default), box-shadow var(--duration-default) var(--ease-default)",
      display: "flex",
      flexDirection: "column",
      ...style,
    }}>
      {messages.length > 0 && (
        <div ref={threadRef} style={{
          flex: 1, overflowY: "auto",
          padding: "20px 24px",
          display: "flex", flexDirection: "column", gap: "16px",
          maxHeight: "320px",
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "10px",
                color: msg.role === "user" ? "var(--accent)" : s.dot,
                textTransform: "uppercase", letterSpacing: ".07em",
              }}>
                {msg.role === "user" ? "You" : "Pedro.ai"}
              </span>
              <div style={{
                fontFamily: msg.role === "user" ? "var(--font-body)" : "var(--font-mono)",
                fontSize: "14px", lineHeight: 1.6,
                color: "var(--text-body)",
                background: msg.role === "user" ? "var(--accent-subtle)" : "var(--bg-surface)",
                border: `1px solid ${msg.role === "user" ? "var(--border-accent)" : "var(--border)"}`,
                borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                padding: "10px 14px",
                maxWidth: "80%",
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          {state === "processing" && (
            <div style={{ display: "flex", gap: "6px", padding: "4px 0 0 2px" }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  width: "7px", height: "7px", borderRadius: "50%",
                  background: "var(--ai-responding)",
                  animation: `dot-bounce 1.2s ${i * 0.15}s ease infinite`,
                  display: "inline-block",
                }} />
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{
        display: "flex", alignItems: "flex-end", gap: "10px",
        padding: "16px 20px",
        borderTop: messages.length > 0 ? "1px solid var(--border)" : "none",
      }}>
        <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center" }}>
          <AIStateIndicator state={state} size="sm" style={{ position: "absolute", left: "14px" }} />
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={placeholder}
            rows={1}
            style={{
              width: "100%",
              fontFamily: "var(--font-body)", fontSize: "15px",
              color: "var(--text-display)",
              background: "transparent",
              border: "none", outline: "none", resize: "none",
              padding: "6px 14px 6px 36px",
              boxSizing: "border-box", lineHeight: 1.5,
              caretColor: "var(--accent)",
            }}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!input.trim() || isActive}
          style={{
            background: input.trim() && !isActive ? "var(--accent)" : "var(--bg-surface)",
            color: input.trim() && !isActive ? "#08080F" : "var(--text-muted)",
            border: `1px solid ${input.trim() && !isActive ? "transparent" : "var(--border)"}`,
            borderRadius: "var(--radius-md)",
            padding: "9px 18px",
            fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 600,
            cursor: input.trim() && !isActive ? "pointer" : "not-allowed",
            transition: "all var(--duration-fast) var(--ease-default)",
            flexShrink: 0,
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
