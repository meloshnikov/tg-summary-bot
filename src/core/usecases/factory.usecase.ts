import { EncryptionServicePort, LLMFactoryPort, KeyManagerPort, MessageRepositoryPort, SettingsServicePort, ExternalDataServicePort } from "../ports";
import { UseCaseFactoryPort } from "../ports/usecase-factory.port";
import { DeleteExpiredMessages } from "./delete-expired-messages.usecase";
import { GenerateReport } from "./generate-report.usecase";
import { GetEntitySettings } from "./get-entity-settings.usecase";
import { UpdateEntityiSetting } from "./update-setting.usecase";
import { GetUserChats } from "./get-user-chats.usecase";
import { SaveMessage } from "./save-messages.usecase";

export class UseCaseFactory implements UseCaseFactoryPort {
  constructor(
    private readonly settingsService: SettingsServicePort,
    private readonly messageRepo: MessageRepositoryPort,
    private readonly llmFactory: LLMFactoryPort,
    private readonly encryptionService: EncryptionServicePort,
    private readonly externalDataService: ExternalDataServicePort,
  ) {}

  getGenerateReport() {
    return new GenerateReport(
      this.messageRepo,
      this.llmFactory.createService(),
      this.encryptionService,
      this.externalDataService,
    );
  }

  getSaveMessage() {
    return new SaveMessage(this.messageRepo, this.settingsService, this.encryptionService);
  }

  getDeleteExpiredMessages() {
    return new DeleteExpiredMessages(this.messageRepo);
  }

  getUserChats() {
    return new GetUserChats(this.messageRepo, this.externalDataService);
  }

  getEntitySettings() {
    return new GetEntitySettings(this.settingsService);
  }

  getUpdateEntitySetting() {
    return new UpdateEntityiSetting(this.settingsService);
  }
}
