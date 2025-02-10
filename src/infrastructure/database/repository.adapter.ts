import { DataSource, MoreThanOrEqual, Repository } from "typeorm";
import { MessageRepositoryPort } from "src/core/ports";
import { Message } from "src/core/entities";
import { Messages } from "./repository.model";

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

  private toOrmModel(message: Message): Messages {
    const ormMessage = new Messages();
    Object.assign(ormMessage, {
      user_id: message.userId,
      first_name: message.firstName,
      last_name: message.lastName,
      username: message.username,
      language_code: message.languageCode,
      is_premium: message.isPremium || false,
      chat_id: message.chatId,
      chat_title: message.chatTitle,
      chat_type: message.chatType,
      date: message.date,
      text: message.text,
    });
    return ormMessage;
  }

  private toEntity(ormMessage: Messages): Message {
    return new Message(
      ormMessage.user_id,
      ormMessage.first_name,
      ormMessage.last_name,
      ormMessage.username,
      ormMessage.language_code,
      ormMessage.is_premium,
      ormMessage.chat_id,
      ormMessage.chat_title,
      ormMessage.chat_type,
      ormMessage.date,
      ormMessage.text || '',
    );
  }
}
