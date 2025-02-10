export interface LLMServicePort {
  generateReport(content: string): Promise<string>;
}
