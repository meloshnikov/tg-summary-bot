
import { Message, Settings, UseCase, UserChat } from "../entities";
import { SettingsEntity, SettingsParams, SettingsType } from "../schemas";

export interface UseCaseFactoryPort {
  getGenerateReport(): UseCase<number, string>;
  getSaveMessage(): UseCase<Message | null, void>;
  getDeleteExpiredMessages(): UseCase<void, number>;
  getUserChats(): UseCase<number, UserChat[]>;
  getEntitySettings(): UseCase<SettingsParams<SettingsEntity>, Settings<SettingsEntity>[]>;
}
