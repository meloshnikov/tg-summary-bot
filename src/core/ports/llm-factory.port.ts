import { ProviderLLM } from "../entities";
import { LLMServicePort } from "./llm-service.port";

export interface LLMFactoryPort {
  createService(provider?: ProviderLLM): LLMServicePort;
}
