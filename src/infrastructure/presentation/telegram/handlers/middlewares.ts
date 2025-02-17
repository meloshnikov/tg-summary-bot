import { TelegramBotPort } from "src/core/ports";
import { HandlerConfig } from "../types";

export const middlewares = (adapter: TelegramBotPort): HandlerConfig[] => [
  {
    type: 'middleware',
    handler: async (ctx, next) => {
      adapter.initBotName(ctx);
      if (adapter.isGroupChat(ctx) && !adapter.isMsgForBot(ctx.message)) {
        const message = adapter.contextToMessage(ctx);
        const getSaveMessage = adapter.useCaseFactory.getSaveMessage();
        await getSaveMessage.execute(message);
      }
      await next();
    }
  }
];
