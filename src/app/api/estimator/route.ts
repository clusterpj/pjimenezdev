import { NextRequest, NextResponse } from 'next/server';
import { getProvider, type ChatMessage } from '@/lib/ai';

interface EstimateResult {
  category: string;
  scope: string[];
  timeline: string;
  budget: string;
  notes: string;
}

const SCHEMA_HINT = JSON.stringify({
  category: 'string — e.g. Web App, AI Integration, Automation, Mobile App, Motion & 3D',
  scope: ['string — key deliverable 1', 'string — key deliverable 2'],
  timeline: 'string — e.g. 4–6 weeks',
  budget: 'string — e.g. $3,000–$6,000',
  notes: 'string — optional caveats or assumptions, empty string if none',
}, null, 2);

const SYSTEM_PROMPT = `You are a senior full-stack developer estimating a software project.
Given a plain-language description, output a realistic project estimate as a JSON object.
Be specific about deliverables. Be honest about timeline and budget — use ranges, not minimums.
Return ONLY valid JSON. No markdown, no preamble, no explanation outside the JSON.`;

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json() as { description?: string };

    if (!body.description || typeof body.description !== 'string' || body.description.trim().length < 10) {
      return NextResponse.json(
        { error: 'description is required and must be at least 10 characters' },
        { status: 400 }
      );
    }

    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: body.description.trim() },
    ];

    const provider = getProvider();
    const result = await provider.structured<EstimateResult>(messages, SCHEMA_HINT);

    // Validate required fields are present
    if (!result.category || !Array.isArray(result.scope) || !result.timeline || !result.budget) {
      return NextResponse.json({ error: 'Provider returned malformed estimate' }, { status: 502 });
    }

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[/api/estimator]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
