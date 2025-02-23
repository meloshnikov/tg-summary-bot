import { Chat } from "../entities";

export interface ChatInfoProviderPort {
  getChatInfo(chatId: number[]): Promise<Chat[]>;
}
