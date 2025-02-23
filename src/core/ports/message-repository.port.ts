import { Message } from "../entities";

export interface MessageRepositoryPort {
  saveMessage(message: Message): Promise<void>;
  getTodayMessages(chatId: number): Promise<Message[]>;
  deleteMessagesOlderThan(timestamp: number): Promise<number>;
  getAllChatIds(): Promise<number[]>;
  getUserChatIds(userId: number): Promise<number[]>;
}
