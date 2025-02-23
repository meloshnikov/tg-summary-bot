import { Chat, Message, User } from "src/core/entities";
import { AbstractChatMember, ChatFromGetChat, Context } from "./types";


export class TelegramMapper {
  static contextToMessage(ctx: Context): Message | null {
    const message = ctx?.message as any;

    if (!message?.text?.trim()) return null;

    return new Message(
      message?.date,
      message?.from.id,
      message?.chat.id,
      message?.text ?? message?.caption,
      undefined,
    );
  }
  static chatToDomain(chat: ChatFromGetChat & { title?: string }): Chat {
    return new Chat(
      chat.id,
      chat.title ?? '',
      chat.type ?? ''
    );
  }

  static userToDomain({user}: AbstractChatMember ): User {
    return new User(
      user.id!,
      user.first_name,
      user.last_name,
      user.username,
    );
  }

  static contextToUser(ctx: Context): User {
    if (ctx.message?.from?.id) {
      const message = ctx.message as any;

      return new User(
        message?.from.id,
        message?.from.first_name,
        message?.from.last_name,
        message?.from.username,
      );
    } else {
      const callback = ctx.callbackQuery as any;

      return new User(
        callback?.from.id,
        callback?.from.first_name,
        callback?.from.last_name,
        callback?.from.username,
      );
    }
  }
}
