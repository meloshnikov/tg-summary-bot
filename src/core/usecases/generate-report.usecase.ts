import { Message, UseCase, User } from "../entities";
import { EncryptionServicePort, ExternalDataServicePort, LLMServicePort, MessageRepositoryPort } from "../ports";

type RealToFake = Record<number, string>;
type FakeToReal = Record<string, number>;

export class GenerateReport implements UseCase {
  constructor(
    private readonly messageRepo: MessageRepositoryPort,
    private readonly llmService: LLMServicePort,
    private readonly encryptionService: EncryptionServicePort,
    private readonly externalDataService: ExternalDataServicePort,
  ) {}

  async execute(chatId: number): Promise<string> {
    let report = 'Нет ценных сообщений за сегодня';
    try {
      const messages = await this.messageRepo.getTodayMessages(chatId);
      const decryptedMessages = await this.decryptMessages(chatId, messages);
      const { realToFake, fakeToReal, userIds } = this.extractUniqMapIds(decryptedMessages);
      const users = await this.externalDataService.getUsersInfo(chatId, userIds);
      const anonMessages = this.anonymizationMessages(decryptedMessages, realToFake);
  
      if (anonMessages.length) {
        const anonReport = await this.llmService.generateReport(anonMessages);
        report = this.deanonReport(anonReport, fakeToReal, users);
      }
      
    } catch (error) {
      report = "Произошла ошибка при подготовке отчета повторите операцию позднее";
    } finally {
      return report;
    }
  }

  private decryptMessages = async (chatId: number, messages: Message[]): Promise<Message[]> => {
    const decryptedMessages = await Promise.all(messages.map(async (message) => {
      const decryptText = await this.encryptionService.decryptWithChatKey(chatId, message.text);
      return message.updateText(decryptText);
    }));

    return decryptedMessages;
  }

  private anonymizationMessages = (messages: Message[], realToFake: RealToFake): string => {
    return messages
      .map((msg) => `${realToFake[msg.userId]}: ${msg.text}`)
      .join('\n');
  }

  private extractUniqMapIds = (messages: Message[]) => {
    const uniqueIds = [...new Set(messages.map((m) => Number(m.userId)))];
    const mappings = {
      realToFake: {} as RealToFake,
      fakeToReal: {} as FakeToReal,
      userIds: uniqueIds,
    };
    
    uniqueIds.forEach((userId, index) => {
      const fakeId = `user${index + 1}`;
      mappings.realToFake[userId] = fakeId;
      mappings.fakeToReal[fakeId] = userId;
    });
    
    return mappings;
  }

  private deanonReport = (response: string, fakeToReal: FakeToReal, users: User[]): string => {
    const userMap = users.reduce<Record<string, string>>((acc, user) => {
      acc[user.id] = user?.firstName ?? user?.username ?? ''
  
      return acc;
    }, {});

    return response.replace(/user\d+/g, (match) => userMap[fakeToReal[match]?.toString()] || match);
  }
}
