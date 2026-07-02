export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface Message {
  role: 'user' | 'ai';
  content: string;
}

export interface AIProvider {
  chat(messages: ChatMessage[]): Promise<string>;
  stream(messages: ChatMessage[]): Promise<ReadableStream<Uint8Array>>;
  structured<T>(messages: ChatMessage[], hint: string): Promise<T>;
}

export type ProviderName = 'deepseek' | 'anthropic' | 'openai';
