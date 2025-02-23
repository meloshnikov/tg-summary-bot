import { DataSource, MoreThanOrEqual, Repository } from "typeorm";
import { MessageRepositoryPort } from "src/core/ports";
import { Chat, Message } from "src/core/entities";
import { MessageModel } from "./message-repository.model";

export class MessageRepositoryAdapter implements MessageRepositoryPort {
  private repository: Repository<MessageModel>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(MessageModel);
  }

  async saveMessage(message: Message): Promise<void> {
    const ormMessage = this.toOrmModel(message);
    await this.repository.save(ormMessage);
  }

  async getTodayMessages(chatId: number): Promise<Message[]> {
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    const today = Math.floor(startOfDay.getTime() / 1000); 
    const messages = await this.repository.find({
      where: {
        chat_id: chatId,
        date: MoreThanOrEqual(today)
      },
      order: { date: "ASC" }
    });
    
    return messages.map(this.toEntity);
  }

  async deleteMessagesOlderThan(timestamp: number): Promise<number> {
    const result = await this.repository
      .createQueryBuilder()
      .delete()
      .where("expiration_date <= :timestamp", { timestamp })
      .execute();

    return result.affected || 0;
  }

  async getAllChatIds(): Promise<number[]> {
    const results = await this.repository
      .createQueryBuilder()
      .select('DISTINCT("chat_id")', 'chat_id')
      .getRawMany();

    return results.map(({ chat_id }) => (chat_id));
  }

  async getUserChatIds(userId: number): Promise<number[]> {
    const results = await this.repository
      .createQueryBuilder()
      .select('DISTINCT(chat_id)', 'chat_id')
      .where({ user_id: userId })
      .getRawMany();

    return results.map(({ chat_id }) => (chat_id));
  }

  private toOrmModel(message: Message): MessageModel {
    const ormMessage = new MessageModel();
    Object.assign(ormMessage, {
      date: message.date,
      user_id: message.userId,
      chat_id: message.chatId,
      text: message.text,
      expiration_date: message.expirationDate,
    });
    return ormMessage;
  }

  private toEntity(ormMessage: MessageModel): Message {
    return new Message(
      ormMessage.date,
      ormMessage.user_id,
      ormMessage.chat_id,
      ormMessage.text || '',
      ormMessage.expiration_date,
    );
  }
}

