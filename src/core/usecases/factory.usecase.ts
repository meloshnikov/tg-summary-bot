import { LLMFactoryPort, MessageRepositoryPort } from "../ports";
import { UseCaseFactoryPort } from "../ports/usecase-factory.port";
import { DeleteExpiredMessages } from "./delete-expired-messages.usecase";
import { GenerateReport } from "./generate-report.usecase";
import { SaveMessage } from "./save-messages.usecase";

export class UseCaseFactory implements UseCaseFactoryPort {
  constructor(
    private readonly messageRepo: MessageRepositoryPort,
    private readonly llmFactory: LLMFactoryPort,
  ) {}

  getGenerateReport() {
    return new GenerateReport(this.messageRepo, this.llmFactory.createService());
  }

  getSaveMessage() {
    return new SaveMessage(this.messageRepo);
  }

  deleteExpiredMessages() {
    return new DeleteExpiredMessages(this.messageRepo);
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
