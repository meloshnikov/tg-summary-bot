import { CallbackQuery, Update } from "telegraf/typings/core/types/typegram";
import { Context, Markup, Telegraf } from "telegraf";
import { envConfig } from "../../config";
import { TelegramBotPort, UseCaseFactoryPort } from "src/core/ports";
import { TelegramMapper } from "src/core/mappers";
import { Settings } from "src/core/entities";


export class TelegramBotAdapter implements TelegramBotPort {
  private botName: string;
  private telegraf: Telegraf;

  constructor(private useCaseFactory: UseCaseFactoryPort) {
    this.telegraf = new Telegraf(envConfig.get('TELEGRAM_BOT_TOKEN'));
    this.botName = 'undefined';
    this.messageHandlers();
  }

  private messageHandlers = () => {
    this.telegraf.use(async (ctx, next) => {
      this.botName = ctx.botInfo.username;

      if (this.isGroupChat(ctx) && !this.isMsgForBot(ctx.message)) {
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

    this.telegraf.command('settings', async (ctx) => {
      await this.handleSettingsCommand(ctx);
    });

    this.telegraf.action('retry-settings', async (ctx) => {
      await ctx.answerCbQuery(); 
      await this.handleSettingsCommand(ctx);
    });

    this.telegraf.action(/^chat_select:/, async (ctx) => {
      await ctx.answerCbQuery();
      
      const callbackQuery = ctx.callbackQuery as CallbackQuery.DataQuery;
      const chatId = Number(callbackQuery.data.split(':')[1]);
      
      await this.handleChatSelectCommand(ctx, chatId);
    });

    this.telegraf.action(/^setting_select:/, async (ctx) => {
      await ctx.answerCbQuery();
      
      const callbackQuery = ctx.callbackQuery as CallbackQuery.DataQuery;
      const setting = callbackQuery.data.split(':')[1];
      
      await ctx.reply('Ты че Баклажан думаешь просто так можешь менять любые параметры?!');
    });
  };

  private async handleSettingsCommand(ctx: Context) {
    const user = TelegramMapper.contextToUser(ctx);
    const getUserChats = this.useCaseFactory.getUserChats();
    const activeUserChats = await getUserChats.execute(user.id);
  
    if (activeUserChats.length) {
      await ctx.reply(
        'Выбери чат для просмотра настроек.',
        Markup.inlineKeyboard([
          activeUserChats.map(({ chatId, chatTitle }) => 
            Markup.button.callback(chatTitle, `chat_select:${chatId}`)
          )
        ])
      );
    } else {
      await ctx.reply(
        'Ваш профиль не обнаружен в активных чатах. Для получения доступа к настройкам, отправьте сообщение в нужном чате и повторите запрос.',
        Markup.inlineKeyboard([
          Markup.button.callback('Запросить настройки повторно', 'retry-settings')
        ])
      );
    }
  }

  private async handleChatSelectCommand(ctx: Context, chatId: number) {
    const getEntitySettings = this.useCaseFactory.getEntitySettings();
    const settings = await getEntitySettings.execute({ entityType: 'chat', entityId: chatId });
    const table = this.formatSettingsTable(settings);

    await ctx.reply(`<pre>Текущие настройки чата:\n\n${table}</pre>`, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          settings.map(({ key }) => ({
            text: key,
            callback_data: `setting_select:${key}`
          }))
        ]
      }
    });
  }

  private formatSettingsTable(settings: Settings<"chat">[]): string {
    const columns = [
      { name: 'Параметр', getValue: (s: Settings<"chat">) => String(s.key) },
      { name: 'Значение', getValue: (s: Settings<"chat">) => String(s.value) },
      { name: 'Изменил', getValue: (s: Settings<"chat">) => String(s.lastModifiedBy) },
      { name: 'Время измнения', getValue: (s: Settings<"chat">) => new Date(s.lastModifiedAt).toLocaleString() },
    ];
  
    const maxWidths = columns.map(col => {
      let max = col.name.length;
      settings.forEach(setting => {
        const value = col.getValue(setting);
        if (value.length > max) max = value.length;
      });
      return max;
    });
  
    const header = columns
      .map((col, i) => col.name.padEnd(maxWidths[i]))
      .join(' | ');
  
    const separator = maxWidths
      .map(width => '-'.repeat(width))
      .join('-+-');
  
    const rows = settings.map((setting) => columns
      .map((col, i) => col.getValue(setting).padEnd(maxWidths[i]))
      .join(' | ')
    );
  
    return [header, separator, ...rows].join('\n');
  };

  private isGroupChat = (ctx: Context<Update>) => ['group', 'supergroup'].includes(ctx.chat?.type ?? '');

  private isMsgForBot = (message: any): boolean => {
    const regExp = new RegExp(this.botName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    return regExp.test(message?.text);
  }

  public start = () => {
    this.telegraf.launch(() => console.log("Бот запущен"));
  };
}
