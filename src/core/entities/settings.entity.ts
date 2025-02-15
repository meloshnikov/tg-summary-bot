import { SettingsEntity, SettingsKey, SettingsValueType } from "../schemas";


export class Settings<T extends SettingsEntity> {
  constructor(
    public readonly entityType: T,
    public readonly entityId: number,
    public readonly key: SettingsKey<T>,
    public readonly value: SettingsValueType<T, SettingsKey<T>>,
    public readonly lastModifiedBy: number | null,
    public readonly lastModifiedAt: string,
  ) {}
}

export type RawSettings = {
  entityType: string;
  entityId: string;
  key: string;
  value: number | string;
  lastModifiedBy: string | null;
  lastModifiedAt: string;
}
