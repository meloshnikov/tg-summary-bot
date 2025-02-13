import { CachePort } from "src/core/ports";
import { SettingsEntity, SettingsKey, SettingsValueType, SettingsSchema } from "src/core/schemas";

type CacheKey = `${SettingsEntity}:${number}`;
type CacheData = {
  [K in SettingsKey<SettingsEntity>]?: SettingsValueType<SettingsEntity, K>
};

export class MemoryCacheAdapter implements CachePort {
  private storage = new Map<CacheKey, CacheData>();

  async get<T extends SettingsEntity, K extends SettingsKey<T>>(
    entityType: T,
    entityId: number,
    key: K
  ): Promise<SettingsValueType<T, K> | undefined> {
    const data = this.storage.get(this.getKey(entityType, entityId));
    return data?.[key] as unknown as SettingsValueType<T, K>;
  }

  async set<T extends SettingsEntity, K extends SettingsKey<T>>(
    entityType: T,
    entityId: number,
    key: K,
    value: SettingsValueType<T, K>
  ): Promise<void> {
    const cacheKey = this.getKey(entityType, entityId);
    const current = this.storage.get(cacheKey) || {};
    this.storage.set(cacheKey, { ...current, [key]: value });
  }

  async delete<T extends SettingsEntity, K extends SettingsKey<T>>(
    entityType: T,
    entityId: number,
    key: K
  ): Promise<void> {
    const cacheKey = this.getKey(entityType, entityId);
    const current = this.storage.get(cacheKey);

    if (current) {
      if (this.isValidKey(entityType, key)) {
        delete current[key as SettingsKey<SettingsEntity>];
        this.storage.set(cacheKey, { ...current });
      }
    }
  }

  async getEntity<T extends SettingsEntity>(
    entityType: T,
    entityId: number
  ): Promise<{ [K in SettingsKey<T>]?: SettingsValueType<T, K> } | undefined> {
    return this.storage.get(this.getKey(entityType, entityId)) as any;
  }

  async setEntity<T extends SettingsEntity>(
    entityType: T,
    entityId: number,
    values: { [K in SettingsKey<T>]?: SettingsValueType<T, K> }
  ): Promise<void> {
    this.storage.set(this.getKey(entityType, entityId), values as CacheData);
  }

  private getKey<T extends SettingsEntity>(entityType: T, entityId: number): CacheKey {
    return `${entityType}:${entityId}` as CacheKey;
  }
  
  private isValidKey<T extends SettingsEntity>(entityType: T, key: string | number | symbol): key is SettingsKey<T> {
    return key in SettingsSchema[entityType];
  }
}
