import { UseCase, Chat } from "../entities";
import { ExternalDataServicePort, MessageRepositoryPort } from "../ports";


export class GetUserChats implements UseCase<number, Chat[]> {
  constructor(
    private messageRepo: MessageRepositoryPort,
    private readonly externalDataService: ExternalDataServicePort,
  ) {}

  async execute(userId: number): Promise<Chat[]> {
    const chatIds = await this.messageRepo.getUserChatIds(userId);
    const chats = await this.externalDataService.getChatInfo(chatIds);

    return chats;
  }
}
