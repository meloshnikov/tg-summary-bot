export interface SettingsRepositoryPort {
  save(entityType: string, entityId: number, key: string, value: any, lastModifiedBy?: number): Promise<void>;
  getValue<T>(entityType: string, entityId: number, key: string): Promise<T | null>;
  getAllValues(entityType: string, entityId: number): Promise<Record<string, any>>;
  deleteKey(entityType: string, entityId: number, key: string): Promise<void>;
}
