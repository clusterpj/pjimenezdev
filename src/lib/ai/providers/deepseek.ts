import type { AIProvider, ChatMessage } from '../types';

const ENDPOINT = 'https://api.deepseek.com/v1/chat/completions';
const MODEL = 'deepseek-chat';

function getKey(): string {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) throw new Error('DEEPSEEK_API_KEY is not set');
  return key;
}

export class DeepSeekProvider implements AIProvider {
  async chat(messages: ChatMessage[]): Promise<string> {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getKey()}`,
      },
      body: JSON.stringify({ model: MODEL, messages, stream: false }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`DeepSeek error ${res.status}: ${text}`);
    }

    const data = await res.json() as {
      choices: { message: { content: string } }[];
    };
    return data.choices[0].message.content;
  }

  async stream(messages: ChatMessage[]): Promise<ReadableStream<Uint8Array>> {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getKey()}`,
      },
      body: JSON.stringify({ model: MODEL, messages, stream: true }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`DeepSeek stream error ${res.status}: ${text}`);
    }

    if (!res.body) throw new Error('DeepSeek returned no response body');

    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    return new ReadableStream<Uint8Array>({
      async start(controller) {
        const reader = res.body!.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            for (const line of chunk.split('\n')) {
              const trimmed = line.trim();
              if (!trimmed.startsWith('data:')) continue;
              const data = trimmed.slice(5).trim();
              if (data === '[DONE]') break;
              try {
                const parsed = JSON.parse(data) as {
                  choices: { delta: { content?: string } }[];
                };
                const token = parsed.choices[0]?.delta?.content;
                if (token) controller.enqueue(encoder.encode(token));
              } catch {
                // skip malformed SSE lines
              }
            }
          }
        } finally {
          controller.close();
          reader.releaseLock();
        }
      },
    });
  }

  async structured<T>(messages: ChatMessage[], hint: string): Promise<T> {
    const withHint: ChatMessage[] = [
      {
        role: 'system',
        content: `${messages.find(m => m.role === 'system')?.content ?? ''}

Return ONLY valid JSON matching this schema — no preamble, no markdown, no code fences:
${hint}`,
      },
      ...messages.filter(m => m.role !== 'system'),
    ];

    const raw = await this.chat(withHint);
    const cleaned = raw.replace(/^```(?:json)?\n?/i, '').replace(/```$/i, '').trim();
    return JSON.parse(cleaned) as T;
  }
}
