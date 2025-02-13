import { DataSource, Repository } from "typeorm";
import { Settings } from "./settings-repository.model";
import { SettingsRepositoryPort } from "src/core/ports";
import { SettingsEntity, SettingsKey, SettingsValueType } from "src/core/schemas/settings-schema";

export class SettingsRepositoryAdapter implements SettingsRepositoryPort {
  private repository: Repository<Settings>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Settings);
  }

  async save<T extends SettingsEntity, K extends SettingsKey<T>>(
    entityType: T,
    entityId: number,
    key: K,
    value: SettingsValueType<T, K>,
    lastModifiedBy?: number
  ): Promise<void> {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

    await this.repository.upsert(
      {
        entityType,
        entityId,
        key: key as string,
        value: stringValue,
        lastModifiedBy,
        lastModifiedAt: new Date()
      },
      ['entityType', 'entityId', 'key']
    );
  }

  async getValue<T extends SettingsEntity, K extends SettingsKey<T>>(
    entityType: T,
    entityId: number,
    key: K
  ): Promise<SettingsValueType<T, K> | null> {
    const result = await this.repository.findOne({
      where: { entityType, entityId, key: key as string }
    });

    if (!result?.value) return null;

    try {
      return JSON.parse(result.value) as SettingsValueType<T, K>;
    } catch {
      return result.value as SettingsValueType<T, K>;
    }
  }

  async getAllValues<T extends SettingsEntity>(
    entityType: T,
    entityId: number
  ): Promise<Partial<{ [K in SettingsKey<T>]: SettingsValueType<T, K> }>> {
    const results = await this.repository.find({
      where: { entityType, entityId }
    });

    return results.reduce((acc, cur) => {
      try {
        acc[cur.key as SettingsKey<T>] = JSON.parse(cur.value!);
      } catch {
        acc[cur.key as SettingsKey<T>] = cur.value;
      }
      return acc;
    }, {} as any);
  }

  async deleteKey<T extends SettingsEntity, K extends SettingsKey<T>>(
    entityType: T,
    entityId: number,
    key: K
  ): Promise<void> {
    await this.repository.delete({ entityType, entityId, key: key as string });
  }
}
