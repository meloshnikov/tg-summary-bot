import { Message, UseCase } from "../entities";
import { LLMServicePort, MessageRepositoryPort } from "../ports";


export class GenerateReport implements UseCase {
  constructor(
    private readonly messageRepo: MessageRepositoryPort,
    private readonly llmService: LLMServicePort
  ) {}

  async execute(chatId: number): Promise<string> {
    let report = 'Нет ценных сообщений за сегодня';
    const messages = await this.messageRepo.getTodayMessages(chatId);
    const content = this.getTextFromMessages(messages);

    if (content.length) {
      report = await this.llmService.generateReport(content); 
    }

    return report;
  }

    private getTextFromMessages = (messages: Message[]) => {
      return messages.reduce<string>((acc, message) => {
        const msg = `${message.username}:\n${message.text}`;
        return `${acc}\n${msg}`;
      }, '');
    }
}
