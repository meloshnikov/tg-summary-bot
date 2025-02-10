import { LLMFactoryPort, MessageRepositoryPort } from "../ports";
import { GenerateReport } from "./generate-report.usecase";
import { SaveMessage } from "./save-messages.usecase";

export class UseCaseFactory {
  constructor(
    private readonly messageRepo: MessageRepositoryPort,
    private readonly llmFactory: LLMFactoryPort,
  ) {}

  getGenerateReport(): GenerateReport {
    return new GenerateReport(this.messageRepo, this.llmFactory.createService());
  }

  getSaveMessage(): SaveMessage {
    return new SaveMessage(this.messageRepo);
  }

  /* добавить сценарий переключения llm сервисов */
  // extractProviderLLM = (text: string): ProbviderLLM => {
  //   const provaderBy: Record<string, ProbviderLLM> = {
  //     google: ProbviderLLM.Google,
  //     openai: ProbviderLLM.Openai,
  //   };

  //   return provaderBy[text] ?? ProbviderLLM.Google
  // };
}
