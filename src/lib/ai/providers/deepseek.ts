import type { AIProvider, ChatMessage } from '../types';
import { getEnv } from '@/lib/env';

const ENDPOINT = 'https://api.deepseek.com/v1/chat/completions';

function getModel(): string {
  return getEnv('DEEPSEEK_MODEL') ?? 'deepseek-v4-flash';
}

function getKey(): string {
  const key = getEnv('DEEPSEEK_API_KEY');
  if (!key) throw new Error('DEEPSEEK_API_KEY is not set');
  return key;
}

export class DeepSeekProvider implements AIProvider {
  async chat(messages: ChatMessage[], maxTokens = 500, reasoningEffort?: 'low' | 'medium' | 'high'): Promise<string> {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getKey()}`,
      },
      body: JSON.stringify({
        model: getModel(), messages, stream: false, max_tokens: maxTokens,
        ...(reasoningEffort ? { reasoning_effort: reasoningEffort } : {}),
      }),
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
      body: JSON.stringify({ model: getModel(), messages, stream: true, max_tokens: 500 }),
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
        let buf = '';
        try {
          outer: while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            // Buffer across reads: an SSE line can be split between chunks,
            // and a partial line would fail JSON.parse and drop tokens.
            buf += decoder.decode(value, { stream: true });
            const lines = buf.split('\n');
            buf = lines.pop() ?? '';
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith('data:')) continue;
              const data = trimmed.slice(5).trim();
              if (data === '[DONE]') break outer;
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

  async structured<T>(messages: ChatMessage[], hint: string, maxTokens = 500): Promise<T> {
    const withHint: ChatMessage[] = [
      {
        role: 'system',
        content: `${messages.find(m => m.role === 'system')?.content ?? ''}

Return ONLY valid JSON matching this schema — no preamble, no markdown, no code fences:
${hint}`,
      },
      ...messages.filter(m => m.role !== 'system'),
    ];

    // max_tokens covers reasoning tokens too, and this model happily spends
    // 7k of an 8k budget thinking — which truncates the JSON mid-string. Low
    // effort keeps the budget for the answer.
    const raw = await this.chat(withHint, maxTokens, 'low');
    const cleaned = raw.replace(/^```(?:json)?\n?/i, '').replace(/```$/i, '').trim();
    try {
      return JSON.parse(cleaned) as T;
    } catch {
      // Almost always a truncated body rather than malformed syntax. Say so,
      // and show the tail — "Unexpected end of JSON input" alone told us nothing.
      throw new Error(
        `DeepSeek returned unparseable JSON (${cleaned.length} chars, max_tokens ${maxTokens}). Tail: ${JSON.stringify(cleaned.slice(-120))}`,
      );
    }
  }
}
