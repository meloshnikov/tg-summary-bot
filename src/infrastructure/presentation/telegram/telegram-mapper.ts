import { Message } from "src/core/entities";

export class TelegramMapper {
  static contextToMessage(ctx: any): Message | null {
    if (!ctx.message?.text?.trim()) return null;

    const message = ctx.message as any;

    return new Message(
      message?.from.id,
      message?.chat.id,
      message?.date,
      undefined,
      message?.from.first_name,
      message?.from.last_name,
      message?.from.username,
      message?.from.language_code,
      Boolean(message?.from.is_premium) ?? false,
      message?.chat.title,
      message?.chat.type,
      message?.text ?? message?.caption,
    );
  }
}
