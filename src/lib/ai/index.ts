import type { AIProvider, ProviderName } from './types';
import { DeepSeekProvider } from './providers/deepseek';

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
      throw new Error('Anthropic provider not yet implemented. See src/lib/ai/providers/deepseek.ts for the pattern.');
    case 'openai':
      throw new Error('OpenAI provider not yet implemented. See src/lib/ai/providers/deepseek.ts for the pattern.');
    default:
      throw new Error(`Unknown AI_PROVIDER: "${name}". Valid values: deepseek, anthropic, openai`);
  }

  return _provider;
}
