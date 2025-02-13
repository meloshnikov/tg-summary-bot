export interface SettingsServicePort {
  get<T>(entityType: string, entityId: number, key: string): Promise<T | null>;
  getAll(entityType: string, entityId: number): Promise<Record<string, any>>;
  set(
    entityType: string, 
    entityId: number, 
    key: string, 
    value: any, 
    lastModifiedBy?: number
  ): Promise<void>;
  delete(entityType: string, entityId: number, key: string): Promise<void>;
}
