import { NextRequest, NextResponse } from "next/server";
import { EMAIL } from "@/lib/content";

const RESEND = "https://api.resend.com/emails";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json() as {
      messages?: { role: string; content: string }[];
      email?: string;
      lang?: string;
    };

    const { messages = [], email = "", lang = "en" } = body;

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "A valid email address is required" }, { status: 400 });
    }
    if (!Array.isArray(messages) || messages.length < 2) {
      return NextResponse.json({ error: "At least a question and reply are required" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("[/api/scope] RESEND_API_KEY not set");
      return NextResponse.json({ error: "Email not configured" }, { status: 500 });
    }

    // Format the conversation as a readable thread
    const thread = messages
      .filter((m) => m.content && m.content.trim())
      .map((m) => {
        const who = m.role === "user" || m.role === "assistant" ? m.role : m.role;
        const label = who === "user" ? (lang === "es" ? "Cliente" : "Client")
          : (lang === "es" ? "Pedro.ai (scoping)" : "Pedro.ai (scoping)");
        return `--- ${label} ---\n${m.content.trim()}`;
      })
      .join("\n\n");

    const subject =
      lang === "es"
        ? `Proyecto nuevo — ${email}`
        : `New project scope — ${email}`;

    const html = `<!DOCTYPE html>
<html><body style="font-family:system-ui,sans-serif;background:#08080F;color:#C8C8D0;padding:32px;max-width:640px;margin:0 auto">
<div style="background:#101019;border:1px solid rgba(255,178,62,.30);border-radius:16px;padding:32px;box-shadow:0 0 24px rgba(255,178,62,.15)">
<h2 style="color:#FFB23E;margin:0 0 8px;font-size:20px">${subject}</h2>
<p style="color:#7A7A88;margin:0 0 24px;font-size:14px">${lang === "es" ? "Alguien acaba de contarle al sitio lo que quiere construir. El agente lo dimensionó en esta conversación." : "Someone just told the site what they want to build. The agent scoped it in this conversation."}</p>
<div style="background:#16161F;border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:24px;white-space:pre-wrap;font:13px/1.65 'JetBrains Mono',monospace;color:#C8C8D0;margin:0 0 24px">${thread.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
<p style="color:#7A7A88;font-size:13px;margin:0">${
  lang === "es"
    ? `Responder directamente a ${email} — está en copia en este email.`
    : `Reply directly to ${email} — they're CC'd on this email.`
}</p>
</div></body></html>`;

    const res = await fetch(RESEND, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `pedrojimenez.dev <scoping@pedrojimenez.dev>`,
        to: [EMAIL],
        cc: [email],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[/api/scope] Resend error", res.status, err);
      return NextResponse.json({ error: "Failed to send email" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/scope]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
