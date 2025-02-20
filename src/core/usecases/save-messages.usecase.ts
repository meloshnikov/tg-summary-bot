import { Message, UseCase } from "../entities";
import { EncryptionServicePort, MessageRepositoryPort, SettingsServicePort } from "../ports";

export class SaveMessage implements UseCase {
  constructor(
    private readonly repository: MessageRepositoryPort,
    private readonly settingsService: SettingsServicePort,
    private readonly encryptionService: EncryptionServicePort,
  ) {}

  async execute(message: Message | null): Promise<void> {
    if (this.isValidMessage(message)) {

      const retentionDays = await this.settingsService.get('chat', message.chatId, 'retention_days');
      const encryptedText = await this.encryptionService.encryptWithChatKey(message.chatId, message.text);
    
      const expirationDate = Math.floor(Date.now() / 1000) + retentionDays * 86400;
      const encryptedMessageWithExpiration = message.withExpiration(expirationDate).updateText(encryptedText);
      await this.repository.saveMessage(encryptedMessageWithExpiration);
    }
  }

  private isValidMessage(message: Message | null): message is Message {
    if (message === null) return false;
    return Boolean(message.text?.length);
  }
}
