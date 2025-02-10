
import { ProviderLLM } from "src/core/entities";
import { LLMFactoryPort, LLMServicePort } from "src/core/ports";
import { GoogleAIAdapter } from "./google.adapter";
import { OpenAIAdapter } from "./openai.adapter";


export class LLMFactoryAdapter implements LLMFactoryPort {
  createService(provider: ProviderLLM = ProviderLLM.Google): LLMServicePort {
    switch (provider) {
      case ProviderLLM.Openai:
        return new OpenAIAdapter();
      case ProviderLLM.Google:
        return new GoogleAIAdapter();
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }
}
