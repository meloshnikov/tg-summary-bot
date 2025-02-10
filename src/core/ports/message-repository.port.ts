import { Message } from "../entities";

export interface MessageRepositoryPort {
  saveMessage(message: Message): Promise<void>;
  getTodayMessages(chatId: number): Promise<Message[]>;
}
