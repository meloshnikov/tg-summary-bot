import { SettingsEntity, SettingsKey, SettingsValueType } from "../schemas/settings-schema";

export interface SettingsRepositoryPort {
  save<T extends SettingsEntity, K extends SettingsKey<T>>(
    entityType: T,
    entityId: number,
    key: K,
    value: SettingsValueType<T, K>,
    lastModifiedBy?: number
  ): Promise<void>;

  getValue<T extends SettingsEntity, K extends SettingsKey<T>>(
    entityType: T,
    entityId: number,
    key: K
  ): Promise<SettingsValueType<T, K> | null>;

  getAllValues<T extends SettingsEntity>(
    entityType: T,
    entityId: number
  ): Promise<Partial<{ [K in SettingsKey<T>]: SettingsValueType<T, K> }>>;

  deleteKey<T extends SettingsEntity, K extends SettingsKey<T>>(
    entityType: T,
    entityId: number,
    key: K
  ): Promise<void>;
}
