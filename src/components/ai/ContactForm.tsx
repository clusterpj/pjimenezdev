"use client";

import React from "react";
import { type Lang, getDict } from "@/lib/content";
import { trackEvent } from "@/lib/gtag";

type State = "idle" | "sending" | "sent" | "error";

const label: React.CSSProperties = {
  font: "500 11px var(--font-mono), monospace", color: "var(--text-muted)",
  textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6, display: "block",
};

const control: React.CSSProperties = {
  width: "100%", background: "var(--bg-base)", border: "1px solid var(--border)",
  borderRadius: "var(--radius-sm)", color: "var(--text-display)",
  font: "400 14px/1.5 var(--font-body), sans-serif", caretColor: "var(--accent)",
  padding: "10px 12px", minHeight: 44,
};

/** The no-AI lead path. Posts to the same /api/scope route as the concierge, so
 *  Pedro gets one inbox format either way — but this works when the model is
 *  down, slow, or the visitor simply doesn't want to talk to a chatbot. Before
 *  this existed the only non-chat route was a mailto: link, which converts
 *  badly and does nothing at all on a machine with no mail client configured. */
export function ContactForm({ lang }: { lang: Lang }) {
  const t = getDict(lang).about;
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [state, setState] = React.useState<State>("idle");

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canSend = emailValid && message.trim().length > 0 && state !== "sending";

  /** GA4 enhanced measurement's own `form_start` is unreliable on a React form
   *  whose submit is preventDefault'd, so the funnel step is explicit. Fires
   *  once, on first interaction with any field — the gap between "expanded the
   *  form" and "actually submitted" is where drop-off hides. */
  const startedRef = React.useRef(false);
  const noteStart = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackEvent("contact_form_start", { mode: "contact" });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend) return;
    setState("sending");
    try {
      const res = await fetch("/api/scope", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim(),
          lang,
          source: "form",
          messages: [{ role: "user", content: message.trim() }],
        }),
      });
      if (!res.ok) throw new Error("send failed");
      setState("sent");
      trackEvent("generate_lead", { mode: "contact", method: "form" });
    } catch {
      setState("error");
    }
  };

  if (state === "sent") {
    return (
      <div style={{
        background: "var(--bg-surface)", border: "1px solid var(--success)",
        borderRadius: "var(--radius-lg)", padding: 24,
        font: "400 14px/1.6 var(--font-body), sans-serif", color: "var(--success)",
      }}>
        {t.formSent}
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      // React's onFocus has focusin semantics (it bubbles), so one handler here
      // covers all three fields.
      onFocus={noteStart}
      style={{
        background: "var(--bg-surface)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)", padding: 24,
        display: "flex", flexDirection: "column", gap: 16,
      }}
    >
      <div style={{ font: "600 15px var(--font-display), sans-serif", color: "#fff" }}>
        {t.formTitle}
      </div>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))" }}>
        <div>
          <label style={label} htmlFor="cf-name">{t.formName}</label>
          <input
            id="cf-name" style={control} value={name} autoComplete="name"
            placeholder={t.formNamePlaceholder}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label style={label} htmlFor="cf-email">{t.formEmail}</label>
          <input
            id="cf-email" style={control} value={email} type="email" required autoComplete="email"
            placeholder={t.formEmailPlaceholder}
            onChange={(e) => { setEmail(e.target.value); if (state === "error") setState("idle"); }}
          />
        </div>
      </div>

      <div>
        <label style={label} htmlFor="cf-msg">{t.formMessage}</label>
        <textarea
          id="cf-msg" required rows={4}
          style={{ ...control, resize: "vertical", minHeight: 104 }}
          value={message}
          placeholder={t.formMessagePlaceholder}
          onChange={(e) => { setMessage(e.target.value); if (state === "error") setState("idle"); }}
        />
      </div>

      {state === "error" && (
        <p role="alert" style={{
          font: "400 13px/1.5 var(--font-body), sans-serif", color: "var(--danger)", margin: 0,
        }}>
          {t.formError}
        </p>
      )}

      <button
        type="submit"
        disabled={!canSend}
        style={{
          background: canSend ? "var(--accent)" : "var(--bg-base)",
          color: canSend ? "#08080F" : "var(--text-muted)",
          border: `1px solid ${canSend ? "transparent" : "var(--border)"}`,
          borderRadius: "var(--radius-md)", padding: "12px 20px",
          font: "600 14px var(--font-body), sans-serif",
          cursor: canSend ? "pointer" : "not-allowed",
          transition: "all .15s", minHeight: 44, alignSelf: "flex-start",
        }}
      >
        {state === "sending" ? t.formSending : t.formSend}
      </button>
    </form>
  );
}
