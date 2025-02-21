import { Settings } from "../entities";
import { SettingsEntity, SettingsKey, SettingsValueType } from "../schemas/settings-schema";

export interface SettingsServicePort {
  get<T extends SettingsEntity, K extends SettingsKey<T>>(
    entityType: T,
    entityId: number,
    key: K
  ): Promise<SettingsValueType<T, K>>;

  getAll<T extends SettingsEntity>(
    entityType: T,
    entityId: number
  ): Promise<Settings<T>[]>;

  set<T extends SettingsEntity, K extends SettingsKey<T>>(
    entityType: T,
    entityId: number,
    key: K,
    value: SettingsValueType<T, K>,
    lastModifiedBy?: number
  ): Promise<void>;

  delete<T extends SettingsEntity, K extends SettingsKey<T>>(
    entityType: T,
    entityId: number,
    key: K
  ): Promise<void>;
}
