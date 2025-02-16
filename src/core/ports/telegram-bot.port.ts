import { Context } from "telegraf";
import { Chat, Update } from "telegraf/typings/core/types/typegram";
import { Message, User } from "../entities";
import { UseCaseFactoryPort } from "./usecase-factory.port";


interface UseCaseFactoryProvider {
  readonly useCaseFactory: UseCaseFactoryPort;
}

export interface TelegramBotPort extends UseCaseFactoryProvider {
  start(): void;
  isMsgForBot: (message: any) => boolean;
  initBotName: (ctx: Context<Update>) => void;
  isGroupChat: (ctx: Context<Update>) => ctx is Context<Update> & { chat: Chat.AbstractChat };
  contextToMessage: (ctx: Context<Update>) => Message | null;
  contextToUser: (ctx: Context<Update>) => User;
  handleSettingsCommand(ctx: Context): Promise<void>;
  
}
