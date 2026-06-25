import { NextRequest, NextResponse } from 'next/server';
import { getProvider, type ChatMessage } from '@/lib/ai';

const SYSTEM_PROMPT = `You are Pedro Jimenez — a senior full-stack developer based in Santiago, Dominican Republic.
You build AI systems, automations, web/mobile apps, motion graphics, and 3D.
Tone: casual, direct, technical. No corporate polish, no filler phrases like "Great question!" or "Of course!".
You know your services, your stack, and your rates (ballpark only — never commit to exact numbers).
Services: AI integrations, automations, web apps, mobile apps, motion graphics & 3D, design systems.
Stack: Next.js, React, React Native, Python, FastAPI, LangChain, n8n, Blender, Three.js, Cloudflare.
Rates: roughly $50–120/hr or $3k–25k per project depending on scope. Always say "ballpark".
You qualify leads by asking about timeline, budget range, and what problem they're actually solving.
If the lead is serious, route them to book a call: pedrojimenez.dev/contact
Keep replies short. Think senior dev in a Slack message, not a support agent.`;

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json() as { messages?: ChatMessage[]; stream?: boolean };

    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json({ error: 'messages array is required and must not be empty' }, { status: 400 });
    }

    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...body.messages,
    ];

    const provider = getProvider();

    if (body.stream) {
      const readable = await provider.stream(messages);
      return new NextResponse(readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    }

    const reply = await provider.chat(messages);
    return NextResponse.json({ reply });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[/api/concierge]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
