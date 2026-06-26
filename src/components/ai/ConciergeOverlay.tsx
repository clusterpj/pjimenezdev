"use client";

import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { AIStateIndicator, type AIState } from "@/components/ai/AIStateIndicator";
import { type Message } from "@/components/ai/ConciergeSurface";
import { streamConcierge } from "@/lib/streamConcierge";
import { useConcierge } from "@/lib/concierge-context";

const PANEL_STATE: Record<string, { border: string; glow: string }> = {
  idle:       { border: "var(--border)",        glow: "var(--shadow-lg)" },
  listening:  { border: "rgba(110,139,255,.45)", glow: "0 0 28px var(--ai-listening-glow), var(--shadow-lg)" },
  processing: { border: "rgba(155,107,255,.45)", glow: "0 0 36px var(--ai-processing-glow), var(--shadow-lg)" },
  responding: { border: "rgba(200,168,255,.35)", glow: "0 0 28px var(--ai-responding-glow), var(--shadow-lg)" },
};

function Bubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px", alignItems: isUser ? "flex-end" : "flex-start" }}>
      <span style={{
        fontFamily: "var(--font-mono)", fontSize: "10px",
        textTransform: "uppercase", letterSpacing: ".07em",
        color: isUser ? "var(--accent)" : "var(--ai-responding)",
      }}>
        {isUser ? "You" : "pedro.ai"}
      </span>
      <div style={{
        fontFamily: isUser ? "var(--font-body)" : "var(--font-mono)",
        fontSize: "14px", lineHeight: 1.6, color: "var(--text-body)",
        background: isUser ? "var(--accent-subtle)" : "var(--bg-surface)",
        border: `1px solid ${isUser ? "var(--border-accent)" : "var(--border)"}`,
        borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
        padding: "11px 14px", maxWidth: "82%",
      }}>
        {msg.content}
      </div>
    </div>
  );
}

export function ConciergeOverlay() {
  const { isOpen, open, close, prefill, clearPrefill } = useConcierge();
  const reduced = useReducedMotion();

  const [aiState, setAiState] = React.useState<AIState>("idle");
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [focused, setFocused] = React.useState(false);

  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const threadRef = React.useRef<HTMLDivElement>(null);
  const msgsRef = React.useRef(messages);
  React.useEffect(() => { msgsRef.current = messages; });

  // Populate input from prefill and focus textarea when overlay opens
  React.useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => {
      if (prefill) {
        setInput(prefill);
        clearPrefill();
      }
      inputRef.current?.focus();
    }, 0);
    return () => clearTimeout(t);
  }, [isOpen, prefill, clearPrefill]);

  // Scroll lock
  React.useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Keyboard shortcuts — always active
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) close(); else open();
      }
      if (e.key === "Escape" && isOpen) close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, open, close]);

  // Auto-scroll thread to bottom
  React.useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages, aiState]);

  const handleSend = React.useCallback(async () => {
    const text = input.trim();
    if (!text || aiState !== "idle") return;
    setInput("");

    const userMsg: Message = { role: "user", content: text };
    const thread = [...msgsRef.current, userMsg];
    setMessages(thread);
    setAiState("processing");

    let isFirst = true;
    try {
      await streamConcierge(thread, (token) => {
        if (isFirst) {
          isFirst = false;
          setAiState("responding");
          setMessages(m => [...m, { role: "ai", content: token }]);
        } else {
          setMessages(m => {
            const next = [...m];
            next[next.length - 1] = { role: "ai", content: next[next.length - 1].content + token };
            return next;
          });
        }
      });
    } catch {
      setMessages(m => [...m, { role: "ai", content: "Connection hiccup — try again." }]);
    } finally {
      setAiState("idle");
    }
  }, [input, aiState]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const isActive = aiState !== "idle";
  const canSend = input.trim().length > 0 && !isActive;
  const panelStateKey = isActive ? aiState : focused ? "listening" : "idle";
  const ps = PANEL_STATE[panelStateKey];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => { if (e.target === e.currentTarget) close(); }}
            style={{
              position: "fixed", inset: 0, zIndex: 200,
              background: "rgba(8,8,15,.80)",
              backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "0 20px",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: reduced ? 1 : 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: reduced ? 1 : 0.96 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ width: "100%", maxWidth: "640px" }}
            >
              {/* Panel */}
              <div style={{
                background: "rgba(16,16,25,.96)",
                backdropFilter: "blur(16px)",
                border: `1px solid ${ps.border}`,
                borderRadius: "var(--radius-xl)",
                boxShadow: ps.glow,
                display: "flex", flexDirection: "column", overflow: "hidden",
                transition: "border-color var(--duration-default) var(--ease-default), box-shadow var(--duration-default) var(--ease-default)",
              }}>
                {/* Header */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "16px 20px 12px",
                }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".04em",
                    color: isActive ? ps.border : "var(--text-muted)",
                    transition: "color var(--duration-default) var(--ease-default)",
                  }}>
                    <AIStateIndicator state={aiState} size="sm" />
                    pedro.ai
                  </span>
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: "10px",
                    color: "var(--text-muted)", letterSpacing: ".06em",
                  }}>
                    esc to close
                  </span>
                </div>

                {/* Thread */}
                {messages.length > 0 && (
                  <div
                    ref={threadRef}
                    style={{
                      display: "flex", flexDirection: "column", gap: "16px",
                      padding: "4px 20px 14px",
                      maxHeight: "min(46vh, 320px)", overflowY: "auto",
                    }}
                  >
                    {messages.map((m, i) => <Bubble key={i} msg={m} />)}
                    {aiState === "processing" && (
                      <div style={{ display: "flex", gap: "6px", padding: "2px 0 0 2px" }}>
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

                {/* Input */}
                <div style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "14px 18px 12px",
                  borderTop: messages.length > 0 ? "1px solid var(--border)" : "none",
                }}>
                  <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center" }}>
                    <span style={{ position: "absolute", left: "4px", display: "flex" }}>
                      <AIStateIndicator state={focused && !isActive ? "listening" : aiState} size="sm" />
                    </span>
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={onKey}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      placeholder="Ask me anything — services, pricing, availability…"
                      rows={1}
                      style={{
                        width: "100%",
                        fontFamily: "var(--font-body)", fontSize: "15px",
                        color: "var(--text-display)",
                        background: "transparent", border: "none", outline: "none",
                        resize: "none", padding: "6px 12px 6px 30px",
                        lineHeight: 1.5, caretColor: "var(--accent)",
                      }}
                    />
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!canSend}
                    style={{
                      flexShrink: 0,
                      fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 600,
                      cursor: canSend ? "pointer" : "not-allowed",
                      background: canSend ? "var(--accent)" : "var(--bg-surface)",
                      color: canSend ? "#08080F" : "var(--text-muted)",
                      border: `1px solid ${canSend ? "transparent" : "var(--border)"}`,
                      borderRadius: "var(--radius-md)", padding: "9px 18px",
                      transition: "all var(--duration-fast) var(--ease-default)",
                    }}
                  >
                    Send
                  </button>
                </div>

                {/* Footer */}
                <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 20px 14px" }}>
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: "10px",
                    color: "var(--text-muted)", letterSpacing: ".06em",
                    border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
                    padding: "3px 8px",
                  }}>
                    ⌘K
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
