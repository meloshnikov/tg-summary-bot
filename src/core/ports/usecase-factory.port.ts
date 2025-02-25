
import { Message, Settings, UseCase, Chat } from "../entities";
import { SettingsEntity, SettingsKey, SettingsParams } from "../schemas";

export interface UseCaseFactoryPort {
  getGenerateReport(): UseCase<number, string>;
  getSaveMessage(): UseCase<Message | null, void>;
  getDeleteExpiredMessages(): UseCase<void, number>;
  getUserChats(): UseCase<number, Chat[]>;
  getEntitySettings(): UseCase<SettingsParams<'get', SettingsEntity>, Settings<SettingsEntity>[]>;
  getUpdateEntitySetting(): UseCase<SettingsParams<'update', SettingsEntity, SettingsKey<SettingsEntity>>, void>;
}
