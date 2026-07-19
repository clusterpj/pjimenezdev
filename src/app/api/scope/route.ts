import { NextRequest, NextResponse } from "next/server";
import { EMAIL } from "@/lib/content";
import { getProvider } from "@/lib/ai";
import { rateLimited } from "@/lib/rate-limit";

const RESEND = "https://api.resend.com/emails";

function summarisePrompt(lang: string) {
  return lang === "es"
    ? `Eres un asistente que extrae información estructurada de una conversación de dimensionamiento de proyecto. Devuelve SOLO JSON válido — sin preámbulos, sin markdown, sin bloques de código.

{
  "headline": "una línea describiendo el proyecto (máx 80 caracteres)",
  "problem": "qué problema resuelve (2-3 frases, sin bullets)",
  "whatTheyWant": "qué quieren construir específicamente (2-3 frases, sin bullets)",
  "timeline": "plazo o urgencia si se mencionó, o 'No mencionado'",
  "budget": "rango de presupuesto si se mencionó, o 'No mencionado'",
  "techNotes": "tecnologías o requerimientos técnicos mencionados, o 'Ninguno mencionado'",
  "scopeReadiness": "ready_to_build | needs_more_info"
}`
    : `You are an assistant that extracts structured information from a project scoping conversation. Return ONLY valid JSON — no preamble, no markdown, no code fences.

{
  "headline": "one line describing the project (max 80 chars)",
  "problem": "what problem it solves (2-3 sentences, no bullets)",
  "whatTheyWant": "what they specifically want built (2-3 sentences, no bullets)",
  "timeline": "deadline or urgency if mentioned, or 'Not mentioned'",
  "budget": "budget range if mentioned, or 'Not mentioned'",
  "techNotes": "technologies or technical requirements mentioned, or 'None mentioned'",
  "scopeReadiness": "ready_to_build | needs_more_info"
}`;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    if (await rateLimited(req)) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

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

    // --- Summarise the conversation via the LLM ---
    const convoText = messages
      .map((m) => {
        const who = m.role === "user" ? (lang === "es" ? "Cliente" : "Client") : "Pedro.ai";
        return `${who}: ${m.content}`;
      })
      .join("\n\n");

    let summary;
    try {
      const provider = getProvider();
      const raw = await provider.chat([
        { role: "system", content: summarisePrompt(lang) },
        { role: "user", content: `Extrae una ficha estructurada de esta conversación de dimensionamiento:\n\n${convoText}` },
      ]);
      const cleaned = raw.replace(/^```(?:json)?\n?/i, "").replace(/```$/i, "").trim();
      summary = JSON.parse(cleaned) as Record<string, string>;
    } catch {
      // Fallback: unstructured but still readable
      summary = {
        headline: lang === "es" ? "Proyecto nuevo" : "New project",
        problem: "",
        whatTheyWant: "",
        timeline: "",
        budget: "",
        techNotes: "",
        scopeReadiness: "needs_more_info",
      };
    }

    const subject =
      lang === "es"
        ? `Nuevo proyecto — ${email}`
        : `New project — ${email}`;

    const isEs = lang === "es";
    const field = (label: string, value: string) =>
      value && value !== "No mencionado" && value !== "Not mentioned" && value !== "Ninguno mencionado" && value !== "None mentioned" && value.trim()
        ? `<div style="margin-bottom:16px"><div style="font:500 11px monospace;color:#FFB23E;text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px">${label}</div><div style="font:400 14px/1.65 system-ui,sans-serif;color:#C8C8D0">${value.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div></div>`
        : "";

    const readinessBadge = summary.scopeReadiness === "ready_to_build"
      ? `<span style="display:inline-block;background:rgba(74,222,154,.12);color:#4ADE9A;border:1px solid rgba(74,222,154,.30);border-radius:8px;padding:4px 12px;font:500 12px monospace;letter-spacing:.06em;text-transform:uppercase">${isEs ? "Listo para dimensionar" : "Ready to scope"}</span>`
      : `<span style="display:inline-block;background:rgba(255,178,62,.08);color:#FFB23E;border:1px solid rgba(255,178,62,.25);border-radius:8px;padding:4px 12px;font:500 12px monospace;letter-spacing:.06em;text-transform:uppercase">${isEs ? "Falta información" : "Needs more info"}</span>`;

    const html = `<!DOCTYPE html>
<html><body style="font-family:system-ui,sans-serif;background:#08080F;color:#C8C8D0;padding:32px;max-width:640px;margin:0 auto">
<div style="background:#101019;border:1px solid rgba(255,178,62,.30);border-radius:16px;padding:32px;box-shadow:0 0 24px rgba(255,178,62,.15)">

<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:20px">
  <h2 style="color:#FFB23E;margin:0;font-size:20px;line-height:1.2">${(summary.headline || subject).replace(/</g, "&lt;").replace(/>/g, "&gt;")}</h2>
  ${readinessBadge}
</div>

${field(isEs ? "El problema" : "The problem", summary.problem)}
${field(isEs ? "Qué quieren construir" : "What they want", summary.whatTheyWant)}
${field(isEs ? "Plazo" : "Timeline", summary.timeline)}
${field(isEs ? "Presupuesto" : "Budget", summary.budget)}
${field(isEs ? "Notas técnicas" : "Tech notes", summary.techNotes)}

<div style="margin-top:24px;padding-top:20px;border-top:1px solid rgba(255,255,255,.08)">
  <div style="font:500 11px monospace;color:#7A7A88;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px">${isEs ? "Contacto" : "Contact"}</div>
  <div style="font:600 16px system-ui,sans-serif;color:#FFB23E">${email.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
  <p style="color:#7A7A88;font-size:13px;margin:8px 0 0">${isEs ? `Responde directo — el cliente está en copia.` : `Reply directly — the client is CC'd on this email.`}</p>
</div>

</div>
<div style="padding:20px 32px 0;font:400 11px monospace;color:#7A7A88;letter-spacing:.04em">
  ${isEs ? "Dimensionado por pedro.ai" : "Scoped by pedro.ai"}
</div>
</body></html>`;

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
