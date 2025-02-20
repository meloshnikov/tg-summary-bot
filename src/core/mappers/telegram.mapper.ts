import { Message, User } from "src/core/entities";
import { Context } from "telegraf";

export class TelegramMapper {
  static contextToMessage(ctx: Context): Message | null {
    const message = ctx?.message as any;

    if (!message?.text?.trim()) return null;

    return new Message(
      message?.from.id,
      message?.chat.id,
      message?.date,
      message?.text ?? message?.caption,
      undefined,
      message?.from.first_name,
      message?.from.last_name,
      message?.from.username,
      message?.from.language_code,
      Boolean(message?.from.is_premium) ?? false,
      message?.chat.title,
      message?.chat.type,
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
