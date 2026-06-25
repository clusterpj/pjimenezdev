import type { AIProvider, ProviderName } from './types';
import { DeepSeekProvider } from './providers/deepseek';
import { AnthropicProvider } from './providers/anthropic';
import { OpenAIProvider } from './providers/openai';

export type { AIProvider, ChatMessage, ProviderName } from './types';

let _provider: AIProvider | null = null;

export function getProvider(): AIProvider {
  if (_provider) return _provider;

  const name = (process.env.AI_PROVIDER ?? 'deepseek') as ProviderName;

  switch (name) {
    case 'deepseek':
      _provider = new DeepSeekProvider();
      break;
    case 'anthropic':
      _provider = new AnthropicProvider();
      break;
    case 'openai':
      _provider = new OpenAIProvider();
      break;
    default:
      throw new Error(`Unknown AI_PROVIDER: "${name}". Valid values: deepseek, anthropic, openai`);
  }

  return _provider;
}
