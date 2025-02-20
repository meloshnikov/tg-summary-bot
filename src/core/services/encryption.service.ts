import { EncryptionServicePort } from "src/core/ports";
import { KeyManagerPort } from "src/core/ports/key-manager.port";
import { SettingsServicePort } from "src/core/ports/settings-service.port";

export class EncryptionService implements EncryptionServicePort {
  constructor(
    private readonly KMS: KeyManagerPort,
    private readonly settingsService: SettingsServicePort,
  ) {}

  async encryptWithChatKey(chatId: number, text: string): Promise<string> {
    const key = await this.getChatKey(chatId);
    return this.KMS.encrypt(key, text);
  }

  async decryptWithChatKey(chatId: number, data: string): Promise<string> {
    const key = await this.getChatKey(chatId);
    return this.KMS.decrypt(key, data);
  }

  private async getChatKey(chatId: number): Promise<Buffer> {
    const encryptedKey = await this.settingsService.get('chat', chatId, 'encrypted_key');
    return encryptedKey ? this.KMS.decryptMaster(encryptedKey) : this.generateChatKey(chatId);
  }

  private async generateChatKey(chatId: number): Promise<Buffer> {
    const newKey = this.KMS.generateKey();
    await this.settingsService.set('chat', chatId, 'encrypted_key', this.KMS.encryptMaster(newKey));
    return newKey;
  }
}
