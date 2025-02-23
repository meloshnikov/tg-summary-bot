import { DataSource } from "typeorm";
import {
  TelegramBotPort,
  LLMFactoryPort,
  MessageRepositoryPort,
  SchedulerPort,
  UseCaseFactoryPort,
  SettingsRepositoryPort,
  SettingsServicePort,
  CachePort,
  KeyManagerPort,
  EncryptionServicePort,
  ExternalDataServicePort,
  UserInfoProviderPort,
  ChatInfoProviderPort,
} from "src/core/ports";

interface ContainerTypes {
  Database: DataSource;
  MemoryCache: CachePort;
  TelegramBot: TelegramBotPort;
  LLMFactory: LLMFactoryPort;
  MessageRepository: MessageRepositoryPort;
  SettingsRepository: SettingsRepositoryPort;
  UseCaseFactory: UseCaseFactoryPort;
  CronScheduler: SchedulerPort;
  UserInfoProvider: UserInfoProviderPort,
  ChatInfoProvider: ChatInfoProviderPort,
  SettingsService: SettingsServicePort;
  KeyManagerService: KeyManagerPort,
  EncryptionService: EncryptionServicePort,
  ExternalDataService: ExternalDataServicePort,
}

type ContainerName = keyof ContainerTypes;

export class DIContainer {
  private static instance: DIContainer;
  private readonly container = new Map<ContainerName, unknown>();

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  register<K extends ContainerName>(key: K, instance: ContainerTypes[K]): void {
    this.container.set(key, instance);
  }

  resolve<K extends ContainerName>(key: K): ContainerTypes[K] {
    const instance = this.container.get(key);
    if (!instance) {
      throw new Error(`Dependency ${key} not found`);
    }
    return instance as ContainerTypes[K];
  }
}
