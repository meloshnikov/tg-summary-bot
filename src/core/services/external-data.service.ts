import { Chat, User } from "../entities";
import { ChatInfoProviderPort, ExternalDataServicePort, UserInfoProviderPort } from "../ports";

export class ExternalDataService implements ExternalDataServicePort {
  constructor(
    private readonly userProvider: UserInfoProviderPort,
    private readonly chatProvider: ChatInfoProviderPort,
  ) {}

  async getChatInfo(chatId: number[]): Promise<Chat[]> {
    return this.chatProvider.getChatInfo(chatId);
  }

  async getUsersInfo(chatId: number, userIds: number[]): Promise<User[]> {
    return this.userProvider.getUsersInfo(chatId, userIds);
  }
}
