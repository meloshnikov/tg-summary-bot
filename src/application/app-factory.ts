import { createDatabase, MessageRepositoryAdapter } from "src/infrastructure/database";
import { TelegramBotAdapter } from "src/infrastructure/telegram";
import { LLMFactoryAdapter } from "src/infrastructure/llm";
import { DIContainer } from "src/infrastructure/di";
import { UseCaseFactory } from "src/core/usecases";
import { scheduleConfig } from "src/infrastructure/config";
import { CronSchedulerAdapter } from "src/infrastructure/scheduler/cron-scheduler.adapter";
import { SettingsRepositoryAdapter } from "src/infrastructure/database/settings-repository.adapter";
import { EncryptionService, ExternalDataService, SettingsService } from "src/core/services";
import { MemoryCacheAdapter } from "src/infrastructure/cache";
import { KeyManagementAdapter } from "src/infrastructure/encryption";


export class AppFactory {
  static async create() {
    const di = DIContainer.getInstance();

    const bot = new TelegramBotAdapter();

    di.register('TelegramBot', bot);
    di.register('UserInfoProvider', di.resolve('TelegramBot'));
    di.register('ChatInfoProvider', di.resolve('TelegramBot'));

    di.register('Database', createDatabase());
    di.register('MemoryCache', new MemoryCacheAdapter());
    di.register('KeyManagerService', new KeyManagementAdapter());

    di.register('ExternalDataService', new ExternalDataService(
      di.resolve('UserInfoProvider'),
      di.resolve('ChatInfoProvider')
    ));

    di.register('MessageRepository', new MessageRepositoryAdapter(di.resolve('Database')));
    di.register('SettingsRepository', new SettingsRepositoryAdapter(di.resolve('Database')));
    di.register('SettingsService', new SettingsService(di.resolve('SettingsRepository'), di.resolve('MemoryCache')));
    di.register('EncryptionService', new EncryptionService(di.resolve('KeyManagerService'), di.resolve('SettingsService')));
    di.register('LLMFactory', new LLMFactoryAdapter());

    di.register('UseCaseFactory', new UseCaseFactory(
      di.resolve('SettingsService'),
      di.resolve('MessageRepository'),
      di.resolve('LLMFactory'),
      di.resolve('EncryptionService'),
      di.resolve('ExternalDataService'),
    ));

    di.register('CronScheduler', new CronSchedulerAdapter(di.resolve('UseCaseFactory'), scheduleConfig));

    bot.initialize(di.resolve('UseCaseFactory'));
  
    return {
      start: async () => {
        await di.resolve('Database').initialize();
        di.resolve('CronScheduler').start();
        di.resolve('TelegramBot').start();
      }
    };
  }
}
