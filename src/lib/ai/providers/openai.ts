import type { AIProvider, ChatMessage } from '../types';

export class OpenAIProvider implements AIProvider {
  async chat(_messages: ChatMessage[]): Promise<string> {
    throw new Error('OpenAI provider is not active — set AI_PROVIDER=openai and implement this stub when needed.');
  }

  async stream(_messages: ChatMessage[]): Promise<ReadableStream<Uint8Array>> {
    throw new Error('OpenAI provider is not active.');
  }

  async structured<T>(_messages: ChatMessage[], _hint: string): Promise<T> {
    throw new Error('OpenAI provider is not active.');
  }
}
