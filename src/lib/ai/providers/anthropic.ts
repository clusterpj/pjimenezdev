import type { AIProvider, ChatMessage } from '../types';

export class AnthropicProvider implements AIProvider {
  async chat(_messages: ChatMessage[]): Promise<string> {
    throw new Error('Anthropic provider is not active — set AI_PROVIDER=anthropic and implement this stub when needed.');
  }

  async stream(_messages: ChatMessage[]): Promise<ReadableStream<Uint8Array>> {
    throw new Error('Anthropic provider is not active.');
  }

  async structured<T>(_messages: ChatMessage[], _hint: string): Promise<T> {
    throw new Error('Anthropic provider is not active.');
  }
}
