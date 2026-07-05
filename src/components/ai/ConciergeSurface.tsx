"use client";

import React from "react";
import { type Lang, getDict } from "@/lib/content";
import { sessionContext, bumpInteraction, trackChip } from "@/lib/session";

export type AiState = "idle" | "processing" | "responding";
export type ConciergeMode = "home" | "contact";

export interface Msg {
  role: "user" | "ai";
  content: string;
}

/** Chat state machine: streams from /api/concierge, drives idle → processing → responding. */
export function useConciergeChat(mode: ConciergeMode, lang: Lang, greeting?: string) {
  const t = getDict(lang);
  const [messages, setMessages] = React.useState<Msg[]>(
    greeting ? [{ role: "ai", content: greeting }] : [],
  );
  const [input, setInput] = React.useState("");
  const [aiState, setAiState] = React.useState<AiState>("idle");
  const [sending, setSending] = React.useState(false);
  const idleTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const currentPage = React.useRef<string>("");

  React.useEffect(() => {
    currentPage.current = window.location.pathname;
    return () => clearTimeout(idleTimer.current);
  }, []);

  const ask = React.useCallback(async (text: string, isChip = false) => {
    const q = (text || "").trim();
    if (!q || sending) return;
    clearTimeout(idleTimer.current);
    bumpInteraction();
    if (isChip) trackChip(text);

    const history = [...messages, { role: "user" as const, content: q }].map((m) => ({
      role: m.role === "ai" ? ("assistant" as const) : ("user" as const),
      content: m.content,
    }));

    setMessages((s) => [...s, { role: "user", content: q }]);
    setInput("");
    setAiState("processing");
    setSending(true);

    try {
      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          mode,
          stream: true,
          currentPage: currentPage.current,
          sessionContext: sessionContext(),
        }),
      });
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      let started = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        if (!started && acc.trim()) {
          started = true;
          setAiState("responding");
          setMessages((s) => [...s, { role: "ai", content: acc }]);
        } else if (started) {
          const snapshot = acc;
          setMessages((s) => [...s.slice(0, -1), { role: "ai", content: snapshot }]);
        }
      }

      if (!acc.trim()) {
        setMessages((s) => [...s, { role: "ai", content: t.concierge.fallback }]);
      }
      setSending(false);
      idleTimer.current = setTimeout(() => setAiState("idle"), 1600);
    } catch {
      setMessages((s) => [...s, { role: "ai", content: t.concierge.error }]);
      setAiState("idle");
      setSending(false);
    }
  }, [messages, sending, mode, t]);

  return { messages, input, setInput, aiState, sending, ask };
}

const surfMap: Record<AiState, { b: string; g: string }> = {
  idle: { b: "var(--border)", g: "var(--shadow-md)" },
  processing: { b: "rgba(155,107,255,.45)", g: "0 0 32px var(--ai-processing-glow)" },
  responding: { b: "rgba(200,168,255,.35)", g: "0 0 24px var(--ai-responding-glow)" },
};

const dotMap: Record<AiState, { c: string; g: string }> = {
  idle: { c: "var(--text-muted)", g: "none" },
  processing: { c: "var(--ai-processing)", g: "0 0 14px var(--ai-processing-glow)" },
  responding: { c: "var(--ai-responding)", g: "0 0 12px var(--ai-responding-glow)" },
};

type ScopeState = "idle" | "sending" | "sent" | "error";

export function ConciergeSurface({
  chat, lang, mode, placeholder, maxThreadHeight = 320,
}: {
  chat: ReturnType<typeof useConciergeChat>;
  lang: Lang;
  mode: ConciergeMode;
  placeholder: string;
  maxThreadHeight?: number;
}) {
  const t = getDict(lang).concierge;
  const { messages, input, setInput, aiState, sending, ask } = chat;
  const threadRef = React.useRef<HTMLDivElement>(null);

  // Email capture for scope submission
  const [email, setEmail] = React.useState("");
  const [scope, setScope] = React.useState<ScopeState>("idle");
  const hasThread = messages.length >= 2;

  React.useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Detect email addresses the visitor types into the chat itself.
  // When the agent asks for an email and the visitor replies with one,
  // auto-populate the capture bar and trigger the send.
  const sentRef = React.useRef(false);
  React.useEffect(() => {
    if (scope === "sending" || scope === "sent" || sentRef.current) return;
    const last = messages.filter((m) => m.role === "user").at(-1);
    if (!last) return;
    const match = last.content.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    if (match) {
      sentRef.current = true;
      const addr = match[1];
      // Let the agent's confirmation message render, then populate + fire
      const timer = setTimeout(async () => {
        setEmail(addr);
        setScope("sending");
        try {
          const res = await fetch("/api/scope", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages, email: addr, lang }),
          });
          if (!res.ok) throw new Error(await res.json().then((d) => d.error).catch(() => "fail"));
          setScope("sent");
        } catch {
          setScope("error");
          sentRef.current = false;
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [messages, scope, lang]);

  const sendScope = async () => {
    if (!email.trim() || scope === "sending" || scope === "sent") return;
    setScope("sending");
    try {
      const res = await fetch("/api/scope", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, email: email.trim(), lang }),
      });
      if (!res.ok) throw new Error(await res.json().then((d) => d.error).catch(() => "fail"));
      setScope("sent");
    } catch {
      setScope("error");
    }
  };

  const sf = surfMap[aiState];
  const d = dotMap[aiState];
  const canSend = input.trim().length > 0 && !sending;
  const hasMessages = messages.length > 0;

  return (
    <div
      className="cc-wrap"
      style={{
        width: "100%",
        background: "rgba(16,16,25,.92)",
        backdropFilter: "blur(16px)",
        border: `1px solid ${sf.b}`,
        borderRadius: "var(--radius-xl)",
        boxShadow: sf.g,
        overflow: "hidden",
        textAlign: "left",
        transition: "border-color .3s var(--ease-default), box-shadow .3s var(--ease-default)",
      }}
    >
      {hasMessages && (
        <div
          ref={threadRef}
          style={{
            maxHeight: maxThreadHeight, overflowY: "auto", padding: "22px 22px 6px",
            display: "flex", flexDirection: "column", gap: 20,
          }}
        >
          {messages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} style={{ alignSelf: "flex-end", display: "flex", flexDirection: "column", gap: 5, alignItems: "flex-end", maxWidth: "88%" }}>
                <span style={{ font: "500 10px var(--font-mono), monospace", color: "var(--accent)", textTransform: "uppercase", letterSpacing: ".08em" }}>
                  {t.you}
                </span>
                <div style={{
                  font: "400 14px/1.6 var(--font-body), sans-serif", color: "var(--text-display)",
                  background: "var(--accent-subtle)", border: "1px solid var(--border-accent)",
                  borderRadius: "16px 16px 4px 16px", padding: "11px 15px",
                }}>
                  {m.content}
                </div>
              </div>
            ) : (
              <div key={i} style={{ alignSelf: "flex-start", display: "flex", flexDirection: "column", gap: 5, alignItems: "flex-start", maxWidth: "90%" }}>
                <span style={{ font: "500 10px var(--font-mono), monospace", color: "var(--ai-responding)", textTransform: "uppercase", letterSpacing: ".08em" }}>
                  {t.ai}
                </span>
                <div style={{
                  font: "400 14px/1.65 var(--font-body), sans-serif", color: "var(--text-body)",
                  background: "var(--bg-surface)", border: "1px solid var(--border)",
                  borderRadius: "16px 16px 16px 4px", padding: "12px 16px",
                }}>
                  {m.content}
                </div>
              </div>
            ),
          )}
          {aiState === "processing" && (
            <div style={{ display: "flex", gap: 6, padding: "2px 0 8px 2px" }}>
              {[0, 0.15, 0.3].map((delay) => (
                <span key={delay} style={{
                  width: 7, height: 7, borderRadius: "50%", background: "var(--ai-responding)",
                  animation: `dot-bounce 1.2s ${delay}s ease infinite`,
                }} />
              ))}
            </div>
          )}

          {scope === "sent" && (
            <div style={{
              alignSelf: "flex-start", background: "var(--bg-surface)", border: "1px solid var(--success)",
              borderRadius: "var(--radius-md)", padding: "14px 18px",
              font: "400 13px/1.5 var(--font-body), sans-serif", color: "var(--success)",
            }}>
              {t.scopeSent}
            </div>
          )}
          {scope === "error" && (
            <div style={{
              alignSelf: "flex-start", background: "var(--bg-surface)", border: "1px solid var(--danger)",
              borderRadius: "var(--radius-md)", padding: "14px 18px",
              font: "400 13px/1.5 var(--font-body), sans-serif", color: "var(--danger)",
            }}>
              {t.scopeError}
            </div>
          )}
        </div>
      )}

      <div style={{
        display: "flex", alignItems: "center", gap: 12, padding: "16px 18px",
        borderTop: `1px solid ${hasMessages ? "var(--border)" : "rgba(255,255,255,0)"}`,
      }}>
        {mode === "home" && (
          <span style={{
            width: 10, height: 10, borderRadius: "50%", background: d.c, boxShadow: d.g,
            flexShrink: 0, transition: "all .3s",
          }} />
        )}
        <input
          className="cc-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              ask(input);
            }
          }}
          placeholder={placeholder}
          style={{
            flex: 1, background: "transparent", border: "none", color: "var(--text-display)",
            font: "400 15px var(--font-body), sans-serif", caretColor: "var(--accent)", minHeight: 44,
          }}
        />
        <button
          onClick={() => ask(input)}
          disabled={!canSend}
          style={{
            background: canSend ? "var(--accent)" : "var(--bg-surface)",
            color: canSend ? "#08080F" : "var(--text-muted)",
            border: `1px solid ${canSend ? "transparent" : "var(--border)"}`,
            borderRadius: "var(--radius-md)", padding: "9px 18px",
            font: "600 14px var(--font-body), sans-serif",
            cursor: canSend ? "pointer" : "not-allowed",
            transition: "all .15s", flexShrink: 0, minHeight: 44,
          }}
        >
          {getDict(lang).home.send}
        </button>
      </div>

      {/* Email capture — shown once the conversation has substance */}
      {hasThread && scope !== "sent" && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "12px 18px 16px", borderTop: "1px solid var(--border)",
        }}>
          <span style={{
            font: "500 11px var(--font-mono), monospace", color: "var(--text-muted)",
            textTransform: "uppercase", letterSpacing: ".06em", flexShrink: 0, whiteSpace: "nowrap",
          }}>
            {t.emailLabel}
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (scope === "error") setScope("idle"); }}
            onKeyDown={(e) => { if (e.key === "Enter") sendScope(); }}
            placeholder={t.emailPlaceholder}
            style={{
              flex: 1, background: "var(--bg-surface)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)", color: "var(--text-display)",
              font: "400 14px var(--font-body), sans-serif", caretColor: "var(--accent)",
              padding: "8px 12px", minHeight: 40, minWidth: 0,
            }}
          />
          <button
            onClick={sendScope}
            disabled={!email.trim() || scope === "sending"}
            style={{
              background: email.trim() ? "var(--accent)" : "var(--bg-surface)",
              color: email.trim() ? "#08080F" : "var(--text-muted)",
              border: `1px solid ${email.trim() ? "transparent" : "var(--border)"}`,
              borderRadius: "var(--radius-md)", padding: "8px 16px",
              font: "600 13px var(--font-body), sans-serif",
              cursor: email.trim() ? "pointer" : "not-allowed",
              transition: "all .15s", flexShrink: 0, minHeight: 40, whiteSpace: "nowrap",
            }}
          >
            {scope === "sending" ? t.sendingScope : t.sendScope}
          </button>
        </div>
      )}
    </div>
  );
}
