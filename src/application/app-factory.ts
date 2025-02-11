import { createDatabase, MessageRepositoryAdapter } from "src/infrastructure/database";
import { TelegramBotAdapter } from "src/infrastructure/presentation";
import { LLMFactoryAdapter } from "src/infrastructure/llm";
import { DIContainer } from "src/infrastructure/di";
import { UseCaseFactory } from "src/core/usecases";
import { scheduleConfig } from "src/infrastructure/config";
import { CronSchedulerAdapter } from "src/infrastructure/scheduler/cron-scheduler.adapter";


export class AppFactory {
  static async create() {
    const di = DIContainer.getInstance();

    di.register('Database', createDatabase());
    di.register('MessageRepository', new MessageRepositoryAdapter(di.resolve('Database')));
    di.register('LLMFactory', new LLMFactoryAdapter());
    di.register('UseCaseFactory', new UseCaseFactory(di.resolve('MessageRepository'), di.resolve('LLMFactory')))
    di.register('TelegramBot', new TelegramBotAdapter(di.resolve('UseCaseFactory')));
    di.register('CronScheduler', new CronSchedulerAdapter(di.resolve('UseCaseFactory'), scheduleConfig));
  
    return {
      start: async () => {
        await di.resolve('Database').initialize();
        di.resolve('CronScheduler').start();
        di.resolve('TelegramBot').start();
      }
    };
  }
}
