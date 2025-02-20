import { Message, UseCase } from "../entities";
import { EncryptionServicePort, LLMServicePort, MessageRepositoryPort } from "../ports";


export class GenerateReport implements UseCase {
  constructor(
    private readonly messageRepo: MessageRepositoryPort,
    private readonly llmService: LLMServicePort,
    private readonly encryptionService: EncryptionServicePort,
  ) {}

  async execute(chatId: number): Promise<string> {
    let report = 'Нет ценных сообщений за сегодня';
    try {
      const messages = await this.messageRepo.getTodayMessages(chatId);
      const content = await this.getDecryptedText(chatId, messages);
  
      if (content.length) {
        report = await this.llmService.generateReport(content); 
      }
      
    } catch (error) {
      report = "Произошла ошибка при подготовки отчета повторите операцию позднее";
    } finally {
      return report
    }
  }

  private getDecryptedText = async (chatId: number, messages: Message[]): Promise<string> => {
    const messagesPromises = messages.map(async (message) => {
      const decryptText = await this.encryptionService.decryptWithChatKey(chatId, message.text);
      return `${message.username}:\n${decryptText}`;
    });
  
    const decryptedMessages = await Promise.all(messagesPromises);
    return decryptedMessages.join('\n');
  }
}
