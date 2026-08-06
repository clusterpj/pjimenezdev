export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface Message {
  role: 'user' | 'ai';
  content: string;
}

export interface AIProvider {
  /** `maxTokens` defaults to 500 — right for concierge replies, far too small
   *  for anything long-form (a truncated JSON body just fails to parse). */
  chat(messages: ChatMessage[], maxTokens?: number, reasoningEffort?: 'low' | 'medium' | 'high'): Promise<string>;
  stream(messages: ChatMessage[]): Promise<ReadableStream<Uint8Array>>;
  structured<T>(messages: ChatMessage[], hint: string, maxTokens?: number): Promise<T>;
}

export type ProviderName = 'deepseek' | 'anthropic' | 'openai';
