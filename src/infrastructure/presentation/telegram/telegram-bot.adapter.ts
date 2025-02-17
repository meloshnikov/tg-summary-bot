
import { envConfig } from "../../config";
import { TelegramBotPort, UseCaseFactoryPort } from "src/core/ports";
import { TelegramMapper } from "src/core/mappers";
import { configureHandlers } from "./handlers";
import { Chat, Context, Markup, Telegraf, Update } from "./types";


export class TelegramBotAdapter implements TelegramBotPort {
  private botName: string;
  private telegraf: Telegraf;

  constructor(public readonly useCaseFactory: UseCaseFactoryPort) {
    this.telegraf = new Telegraf(envConfig.get('TELEGRAM_BOT_TOKEN'));
    this.botName = 'undefined';
    this.registerHandlers();
  }

  private registerHandlers() {
    const handlers = configureHandlers(this);

    handlers.forEach((config) => {
      switch(config.type) {
        case 'command':
          this.telegraf.command(config.name, config.handler);
          break;
          
        case 'action':
          this.telegraf.action(config.pattern, config.handler);
          break;
          
        case 'hears':
          this.telegraf.hears(config.pattern, config.handler);
          break;
          
        case 'middleware':
          this.telegraf.use(config.handler);
          break;
      }
  })
}

  public handleSettingsCommand = async(ctx: Context) => {
    const user = this.contextToUser(ctx);
    const getUserChats = this.useCaseFactory.getUserChats();
    const activeUserChats = await getUserChats.execute(user.id);
  
    if (activeUserChats.length) {
      await ctx.reply(
        'Выбери чат для просмотра настроек.',
        Markup.inlineKeyboard([
          activeUserChats.map(({ chatId, chatTitle }) => 
            Markup.button.callback(chatTitle, `chat_select:chat:${chatId}`)
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
  };

  public contextToMessage = (ctx: Context<Update>) => TelegramMapper.contextToMessage(ctx);

  public contextToUser = (ctx: Context<Update>) => TelegramMapper.contextToUser(ctx);

  public initBotName = (ctx: Context<Update>) => { this.botName = ctx.botInfo.username };

  public isGroupChat(ctx: Context<Update>): ctx is Context<Update> & { chat: Chat.GroupChat | Chat.SupergroupChat } {
    return ['group', 'supergroup'].includes(ctx.chat?.type ?? '');
  };

  public isMsgForBot = (message: any): boolean => {
    const regExp = new RegExp(this.botName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    return regExp.test(message?.text);
  };

  public start = () => {
    this.telegraf.launch(() => console.log("Бот запущен"));
  };
}
