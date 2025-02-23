
import { envConfig } from "../config";
import { ExternalDataServicePort, TelegramBotPort, UseCaseFactoryPort } from "src/core/ports";
import { TelegramMapper } from "src/core/mappers";
import { configureHandlers } from "./handlers";
import { Chat as TgChat, Context, Markup, Telegraf, Update } from "./types";
import { User, Chat } from "src/core/entities";


export class TelegramBotAdapter implements TelegramBotPort, ExternalDataServicePort {
  private botName!: string;         // Definite assignment assertion
  private telegraf!: Telegraf;      // Гарантируем инициализацию
  public state!: Map<string, string>;
  public useCaseFactory!: UseCaseFactoryPort;

  constructor() {
    this.initializeCoreComponents();
  }

  private initializeCoreComponents() {
    this.telegraf = new Telegraf(envConfig.get('TELEGRAM_BOT_TOKEN'));
    this.state = new Map<string, string>();
    this.botName = 'initializing...';
  }

  public initialize(factory: UseCaseFactoryPort) {
    if (!this.useCaseFactory) {
      this.useCaseFactory = factory;
      this.botName = this.telegraf.botInfo?.username || 'undefined';
      this.registerHandlers();
    }
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
          activeUserChats.map(({ id: chatId, title: chatTitle }) => 
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

  public getChatInfo = async (chatIds: number[]) => {
    const chats = await Promise.all(
      chatIds.map(async (id) => 
        await this.telegraf.telegram.getChat(id)
          .then((chat) => TelegramMapper.chatToDomain(chat))
          .catch((error) => {
            console.error(`Error fetching chat ${id}:`, error);
            return null;
          })
      )
    );
  
    return chats.filter((chat): chat is Chat => chat !== null);
  }

  public getUsersInfo = async (chatId: number, userIds: number[]) => {
    const members = await Promise.all(
      userIds.map(async (userId) => 
        await this.telegraf.telegram.getChatMember(chatId, userId)
          .then((member) => TelegramMapper.userToDomain(member))
          .catch((error) => {
            console.error(`Error fetching user ${userId}:`, error);
            return null;
          })
      )
    );
  
    return members.filter((user): user is User => user !== null);
  }

  public contextToMessage = (ctx: Context<Update>) => TelegramMapper.contextToMessage(ctx);

  public contextToUser = (ctx: Context<Update>) => TelegramMapper.contextToUser(ctx);

  public initBotName = (ctx: Context<Update>) => { this.botName = ctx.botInfo.username };

  public isGroupChat(ctx: Context<Update>): ctx is Context<Update> & { chat: TgChat.GroupChat | TgChat.SupergroupChat } {
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
