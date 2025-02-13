import { Message, UseCase } from "../entities";
import { MessageRepositoryPort, SettingsServicePort } from "../ports";

const DEFAULT_RETENTION_DAYS = 7;
export class SaveMessage implements UseCase {
  constructor(
    private readonly repository: MessageRepositoryPort,
    private readonly settingsService: SettingsServicePort,
  ) {}

  async execute(message: Message | null): Promise<void> {
    if (this.isValidMessage(message)) {

      const retentionDays = await this.settingsService.get<number>('chat', message.chatId, 'retention_days') || DEFAULT_RETENTION_DAYS;
    
      const expirationDate = Math.floor(Date.now() / 1000) + retentionDays * 86400;
      const messageWithExpiration = message.withExpiration(expirationDate);
      await this.repository.saveMessage(messageWithExpiration);
    }
  }

  private isValidMessage(message: Message | null): message is Message {
    if (message === null) return false;
    return Boolean(message.text?.length);
  }
}
