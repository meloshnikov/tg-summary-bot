import { Chat, User } from "../entities";


export interface ExternalDataServicePort {
  getChatInfo(chatId: number[]): Promise<Chat[]>;
  getUsersInfo(chatId: number, userIds: number[]): Promise<User[]>;
}

