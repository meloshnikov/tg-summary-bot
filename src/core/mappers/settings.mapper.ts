import { Settings } from "../entities";
import { SettingsEntity, SettingsKey, SettingsValueType } from "../schemas";

export class SettingsMapper {
  static toDomain<T extends SettingsEntity>(rawSettings: any[]): Settings<T>[] {
    return rawSettings.map((raw) => {
      let parsedValue: SettingsValueType<T, any>;
      try {
        parsedValue = JSON.parse(raw.value);
      } catch {
        parsedValue = raw.value;
      }

      return new Settings<T>(
        raw.entityType,
        raw.entityId,
        raw.key,
        parsedValue,
        raw.lastModifiedBy ?? 'System',
        raw.lastModifiedAt
      );
    });
  }

  static toDomainObject<T extends SettingsEntity>(
    rawSettings: any[]
  ): Partial<{ [K in SettingsKey<T>]: SettingsValueType<T, K> }> {
    return rawSettings.reduce((acc, cur) => {
      try {
        acc[cur.key] = JSON.parse(cur.value);
      } catch {
        acc[cur.key] = cur.value;
      }
      return acc;
    }, {} as any);
  }
}
