import { DataSource, MoreThanOrEqual, Repository } from "typeorm";
import { MessageRepositoryPort } from "src/core/ports";
import { Message } from "src/core/entities";
import { Messages } from "./message-repository.model";

export class MessageRepositoryAdapter implements MessageRepositoryPort {
  private repository: Repository<Messages>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Messages);
  }

  async saveMessage(message: Message): Promise<void> {
    const ormMessage = this.toOrmModel(message);
    await this.repository.save(ormMessage);
  }

  async getTodayMessages(chatId: number): Promise<Message[]> {
    const today = Math.floor(Date.now() / 1000) - 86400;
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

    return results.map(r => r.chat_id);
  }

  private toOrmModel(message: Message): Messages {
    const ormMessage = new Messages();
    Object.assign(ormMessage, {
      user_id: message.userId,
      chat_id: message.chatId,
      date: message.date,
      expiration_date: message.expirationDate,
      first_name: message.firstName,
      last_name: message.lastName,
      username: message.username,
      language_code: message.languageCode,
      is_premium: message.isPremium || false,
      chat_title: message.chatTitle,
      chat_type: message.chatType,
      text: message.text,
    });
    return ormMessage;
  }

  private toEntity(ormMessage: Messages): Message {
    return new Message(
      ormMessage.user_id,
      ormMessage.chat_id,
      ormMessage.date,
      ormMessage.expiration_date,
      ormMessage.first_name,
      ormMessage.last_name,
      ormMessage.username,
      ormMessage.language_code,
      ormMessage.is_premium,
      ormMessage.chat_title,
      ormMessage.chat_type,
      ormMessage.text || '',
    );
  }
}

