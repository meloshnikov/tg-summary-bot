import { createDatabase, MessageRepositoryAdapter } from "src/infrastructure/database";
import { TelegramBotAdapter } from "src/infrastructure/presentation";
import { LLMFactoryAdapter } from "src/infrastructure/llm";
import { DIContainer } from "src/infrastructure/di";

export class AppFactory {
  static async create() {
    const di = DIContainer.getInstance();

    di.register('Database', createDatabase());
    di.register('MessageRepository', new MessageRepositoryAdapter(di.resolve('Database')));
    di.register('LLMFactory', new LLMFactoryAdapter());
    di.register('TelegramBot', new TelegramBotAdapter(di.resolve('MessageRepository'), di.resolve('LLMFactory')));
  
    return {
      start: async () => {
        await di.resolve('Database').initialize();
        await di.resolve('TelegramBot').start();
      }
    };
  }
}
