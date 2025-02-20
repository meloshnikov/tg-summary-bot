import { TelegramBotPort } from "src/core/ports";
import { HandlerConfig } from "../types";

export const hears = (adapter: TelegramBotPort): HandlerConfig[] => [
  {
    type: 'hears',
    pattern: /доложи\s+обстановку|обстановку\s+доложи/i,
    description: 'Генерация отчета',
    handler: async (ctx) => {
      if (!adapter.isGroupChat(ctx) || !adapter.isMsgForBot(ctx.message)) return;
      
      const generateReport = adapter.useCaseFactory.getGenerateReport();
      const standByMessage = await ctx.reply("Обрабатываю ваш запрос...");
      const summaryReport = await generateReport.execute(ctx.chat.id)
      await ctx.telegram.deleteMessage(ctx.chat.id, standByMessage.message_id);
      await ctx.reply(summaryReport);
    }
  },
];
