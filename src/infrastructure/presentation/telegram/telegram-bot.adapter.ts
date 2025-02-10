import { Telegraf } from "telegraf";
import { envConfig } from "../../config";
import { UseCaseFactory } from "src/core/usecases";
import { LLMFactoryPort, MessageRepositoryPort } from "src/core/ports";
import { TelegramMapper } from "./telegram-mapper";


export class TelegramBotAdapter {
  private botName: string;
  private telegraf: Telegraf;
  private useCaseFactory: UseCaseFactory;

  constructor(
    private repository: MessageRepositoryPort,
    private llmFactory: LLMFactoryPort
  ) {
    this.telegraf = new Telegraf(envConfig.get('TELEGRAM_BOT_TOKEN'));
    this.useCaseFactory = new UseCaseFactory(this.repository, this.llmFactory);
    this.botName = 'undefined';
    this.messageHandlers();
  }

  private messageHandlers = () => {
    this.telegraf.use(async (ctx, next) => {
      this.botName = ctx.botInfo.username;
      if (!this.isGroupChat(ctx)) return;

      if (!this.isMsgForBot(ctx.message)) {
        const message = TelegramMapper.contextToMessage(ctx);
        const saveMessage = this.useCaseFactory.getSaveMessage();
        await saveMessage.execute(message);
      }

      await next();
    });

    this.telegraf.hears(/доложи\s+обстановку|обстановку\s+доложи/i, async (ctx) => {
      if (!this.isMsgForBot(ctx.message)) return;

      const generateReport = this.useCaseFactory.getGenerateReport();
      const standByMessage = await ctx.reply("Обрабатываю ваш пиздеж...");
      const summaryReport = await generateReport.execute(ctx.chat.id)
      await ctx.telegram.deleteMessage(ctx.chat.id, standByMessage.message_id);
      await ctx.reply(summaryReport);
    }); 
  };

  private isGroupChat = (ctx: any) => 
    ['group', 'supergroup'].includes(ctx.chat?.type);

  private isMsgForBot = (message: any): boolean => {
    const regExp = new RegExp(this.botName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    return regExp.test(message?.text);
  }

  public start = async () => {
    await this.telegraf.launch(() => console.log("Бот запущен"));
  };
}
