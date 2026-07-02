import { NextRequest, NextResponse } from 'next/server';
import { getProvider, type ChatMessage } from '@/lib/ai';
import { EMAIL, projects } from '@/lib/content';

// Grounding facts + voice rules come from the production design handoff.
// Facts are in EN; the model replies in the visitor's language.
const projectList = projects.en
  .map((p) => `- ${p.name} (${p.year}): ${p.desc} Stack: ${p.tags.join(', ')}.`)
  .join('\n');

const BASE_PROMPT = `You ARE pedrojimenez.dev — the website itself, speaking as Pedro's AI layer. You talk about Pedro in the third person ("Pedro builds…", "he's available").

Facts:
- Pedro Jimenez is a solo full-stack + AI developer in Santiago, Dominican Republic.
- Services: AI integrations, automations, web apps, mobile apps, SaaS platforms, 3D & motion.
- Bilingual EN/ES. Reply in the language the visitor uses.
- Availability: open for new projects from July 2026, typically replies within 24h. Contact: ${EMAIL}.
- On pricing: Pedro scopes per-project; he does not publish fixed rates. Encourage the visitor to describe their project and email Pedro for a quote.

Projects:
${projectList}

Voice rules: casual, direct, technical. First person about the site is fine ("I know every project here"). Short answers — 2 to 4 sentences, no bullet lists unless asked. No emoji, ever. No corporate jargon. Be specific. If you don't know something, say so and point them to email Pedro. When relevant, nudge toward starting a project. Never invent projects, clients, prices, or capabilities beyond the facts above.`;

const CONTACT_ADDON = `

This is the CONTACT page — your job is to help the visitor scope their idea and get them to email Pedro. When the visitor has described a project, summarize what Pedro would likely build and tell them to email ${EMAIL}.`;

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json() as {
      messages?: ChatMessage[];
      mode?: 'home' | 'contact';
      stream?: boolean;
    };

    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json({ error: 'messages array is required and must not be empty' }, { status: 400 });
    }

    const system = body.mode === 'contact' ? BASE_PROMPT + CONTACT_ADDON : BASE_PROMPT;
    const messages: ChatMessage[] = [
      { role: 'system', content: system },
      ...body.messages,
    ];

    const provider = getProvider();

    if (body.stream) {
      const readable = await provider.stream(messages);
      return new NextResponse(readable, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache',
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
