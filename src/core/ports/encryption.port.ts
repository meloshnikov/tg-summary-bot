export interface EncryptionServicePort {
  encryptWithChatKey(chatId: number, text: string): Promise<string>;
  decryptWithChatKey(chatId: number, encryptedText: string): Promise<string>;
}
