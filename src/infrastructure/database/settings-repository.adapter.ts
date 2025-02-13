import { DataSource, Repository } from "typeorm";
import { Settings } from "./settings-repository.model";
import { SettingsRepositoryPort } from "src/core/ports";

export class SettingsRepositoryAdapter implements SettingsRepositoryPort {
  private repository: Repository<Settings>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Settings);
  }

  async save(entityType: string, entityId: number, key: string, value: any, lastModifiedBy?: number): Promise<void> {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    
    await this.repository.upsert(
      {
        entityType,
        entityId,
        key,
        value: stringValue,
        lastModifiedBy,
        lastModifiedAt: new Date()
      },
      ['entityType', 'entityId', 'key']
    );
  }

  async getValue<T>(entityType: string, entityId: number, key: string): Promise<T | null> {
    const result = await this.repository.findOne({
      where: { entityType, entityId, key }
    });
    
    if (!result?.value) return null;
    
    try {
      return JSON.parse(result.value) as T;
    } catch {
      return result.value as T;
    }
  }

  async getAllValues(entityType: string, entityId: number): Promise<Record<string, any>> {
    const results = await this.repository.find({
      where: { entityType, entityId }
    });

    return results.reduce((acc, cur) => {
      try {
        acc[cur.key] = JSON.parse(cur.value!);
      } catch {
        acc[cur.key] = cur.value;
      }
      return acc;
    }, {} as Record<string, any>);
  }

  async deleteKey(entityType: string, entityId: number, key: string): Promise<void> {
    await this.repository.delete({ entityType, entityId, key });
  }
}
