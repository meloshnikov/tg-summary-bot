import { LLMFactoryPort, MessageRepositoryPort, SettingsServicePort } from "../ports";
import { UseCaseFactoryPort } from "../ports/usecase-factory.port";
import { DeleteExpiredMessages } from "./delete-expired-messages.usecase";
import { GenerateReport } from "./generate-report.usecase";
import { GetEntitySettings } from "./get-entity-settings.usecase";
import { GetUserChats } from "./get-user-chats.usecase";
import { SaveMessage } from "./save-messages.usecase";

export class UseCaseFactory implements UseCaseFactoryPort {
  constructor(
    private readonly settingsService: SettingsServicePort,
    private readonly messageRepo: MessageRepositoryPort,
    private readonly llmFactory: LLMFactoryPort,
  ) {}

  getGenerateReport() {
    return new GenerateReport(this.messageRepo, this.llmFactory.createService());
  }

  getSaveMessage() {
    return new SaveMessage(this.messageRepo, this.settingsService);
  }

  getDeleteExpiredMessages() {
    return new DeleteExpiredMessages(this.messageRepo);
  }

  getUserChats() {
    return new GetUserChats(this.messageRepo);
  }

  getEntitySettings() {
    return new GetEntitySettings(this.settingsService);
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
