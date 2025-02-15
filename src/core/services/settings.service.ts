import { DefaultSettingsConfig } from "src/infrastructure/config";
import { CachePort, SettingsRepositoryPort, SettingsServicePort } from "../ports";
import { SettingsEntity, SettingsKey, SettingsValueType } from "../schemas/settings-schema";
import { Settings } from "../entities";

export class SettingsService implements SettingsServicePort {
  constructor(
    private repository: SettingsRepositoryPort,
    private cache: CachePort
  ) {}

  async get<T extends SettingsEntity, K extends SettingsKey<T>>(
    entityType: T,
    entityId: number,
    key: K
  ): Promise<SettingsValueType<T, K>> {
    const cachedValue = await this.cache.get(entityType, entityId, key);
    if (cachedValue !== undefined) return cachedValue;

    const storedValue = await this.repository.getValue(entityType, entityId, key);
    if (storedValue !== null) {
      await this.cache.set(entityType, entityId, key, storedValue);
      return storedValue;
    }

    const defaultValue = this.getDefaultValue(entityType, key);
    await this.set(entityType, entityId, key, defaultValue);
    await this.repository.save(entityType, entityId, key, defaultValue);
    return defaultValue;
  }

  async set<T extends SettingsEntity, K extends SettingsKey<T>>(
    entityType: T,
    entityId: number,
    key: K,
    value: SettingsValueType<T, K>,
    lastModifiedBy?: number
  ): Promise<void> {
    await this.repository.save(entityType, entityId, key, value, lastModifiedBy);
    await this.cache.set(entityType, entityId, key, value);
  }

  async delete<T extends SettingsEntity, K extends SettingsKey<T>>(
    entityType: T,
    entityId: number,
    key: K
  ): Promise<void> {
    await this.repository.deleteKey(entityType, entityId, key);
    await this.cache.delete(entityType, entityId, key);
  }

  async getAll<T extends SettingsEntity>(
    entityType: T,
    entityId: number
  ): Promise<Settings<T>[]> {
    return await this.repository.getAllValues(entityType, entityId);
  }

  private getDefaultValue<T extends SettingsEntity, K extends SettingsKey<T>>(
    entityType: T,
    key: K
  ): SettingsValueType<T, K> {
    const defaultValue = DefaultSettingsConfig[entityType][key];

    const expectedType = typeof DefaultSettingsConfig[entityType][key];
    if (typeof defaultValue !== expectedType) {
      throw new Error(`Invalid default type for ${entityType}.${key.toString()}: expected ${expectedType}`);
    }

    return defaultValue as SettingsValueType<T, K>;
  }
}
