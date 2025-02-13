import { SettingsRepositoryPort, SettingsServicePort } from "../ports";

export class SettingsService implements SettingsServicePort {
  private cache = new Map<string, Map<string, any>>();

  constructor(private repository: SettingsRepositoryPort) {}

  async get<T>(entityType: string, entityId: number, key: string): Promise<T | null> {
    const entityCache = this.getEntityCache(entityType, entityId);
    if (entityCache.has(key)) return entityCache.get(key);

    const value = await this.repository.getValue<T>(entityType, entityId, key);
    if (value !== null) {
      entityCache.set(key, value);
    }
    return value;
  }

  async getAll(entityType: string, entityId: number): Promise<Record<string, any>> {
    const cacheKey = this.getCacheKey(entityType, entityId);
    if (this.cache.has(cacheKey)) {
      return Object.fromEntries(this.cache.get(cacheKey)!);
    }

    const values = await this.repository.getAllValues(entityType, entityId);
    const cacheMap = new Map(Object.entries(values));
    this.cache.set(cacheKey, cacheMap);
    return values;
  }

  async set(entityType: string, entityId: number, key: string, value: any, lastModifiedBy?: number): Promise<void> {
    await this.repository.save(entityType, entityId, key, value, lastModifiedBy);
    this.updateCache(entityType, entityId, key, value);
  }

  async delete(entityType: string, entityId: number, key: string): Promise<void> {
    await this.repository.deleteKey(entityType, entityId, key);
    this.updateCache(entityType, entityId, key, undefined);
  }

  private getCacheKey(entityType: string, entityId: number): string {
    return `${entityType}:${entityId}`;
  }

  private getEntityCache(entityType: string, entityId: number): Map<string, any> {
    const cacheKey = this.getCacheKey(entityType, entityId);
    if (!this.cache.has(cacheKey)) {
      this.cache.set(cacheKey, new Map());
    }
    return this.cache.get(cacheKey)!;
  }

  private updateCache(entityType: string, entityId: number, key: string, value: any): void {
    const cache = this.getEntityCache(entityType, entityId);
    if (value === undefined) {
      cache.delete(key);
    } else {
      cache.set(key, value);
    }
  }
}
