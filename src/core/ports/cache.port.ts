import { SettingsEntity, SettingsKey, SettingsValueType } from "../schemas/settings-schema";

export interface CachePort {
  get<T extends SettingsEntity, K extends SettingsKey<T>>(
    entityType: T,
    entityId: number,
    key: K
  ): Promise<SettingsValueType<T, K> | undefined>;

  set<T extends SettingsEntity, K extends SettingsKey<T>>(
    entityType: T,
    entityId: number,
    key: K,
    value: SettingsValueType<T, K>
  ): Promise<void>;

  delete<T extends SettingsEntity, K extends SettingsKey<T>>(
    entityType: T,
    entityId: number,
    key: K
  ): Promise<void>;

  getEntity<T extends SettingsEntity>(
    entityType: T,
    entityId: number
  ): Promise<{ [K in SettingsKey<T>]?: SettingsValueType<T, K> } | undefined>;

  setEntity<T extends SettingsEntity>(
    entityType: T,
    entityId: number,
    values: { [K in SettingsKey<T>]?: SettingsValueType<T, K> }
  ): Promise<void>;
}
