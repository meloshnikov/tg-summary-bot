import { DataSource } from "typeorm";
import { BotPort, LLMFactoryPort, MessageRepositoryPort } from "src/core/ports";

interface ContainerTypes {
  TelegramBot: BotPort;
  LLMFactory: LLMFactoryPort;
  Database: DataSource;
  MessageRepository: MessageRepositoryPort;
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
