export const SettingsSchema = {
  chat: {
    retention_days: 'number',
    llm_provider: 'string',
    encrypted_key: 'string',
  },
} as const;

export const SettingsSchemaKeys = (
  Object.values(SettingsSchema)
    .flatMap(settings => Object.keys(settings))
    .reduce((acc, key) => ({
      ...acc,
      [key]: key
    }), {} as { [K in SettingsKey<SettingsEntity>]: K })
);

export type SettingsEntity = keyof typeof SettingsSchema;
export type SettingsKey<T extends SettingsEntity> = keyof typeof SettingsSchema[T];
export type SettingsValueType<T extends SettingsEntity, K extends SettingsKey<T>> = 
  typeof SettingsSchema[T][K] extends 'number' ? number :
  typeof SettingsSchema[T][K] extends 'string' ? string :
  never;

export type SettingsType = {
  [T in SettingsEntity]: {
    [K in SettingsKey<T>]: SettingsValueType<T, K>
  };
};

export type GetSettingsParams<T extends SettingsEntity> = {
  entityType: T;
  entityId: number;
  key?: SettingsKey<T>
};

export type UpdateSettingsParams<T extends SettingsEntity, K extends SettingsKey<T>> = {
  entityType: T;
  entityId: number;
  key: K;
  value: SettingsValueType<T, K>;
  modifiedBy?: number;
};

export type SettingsParams<
  Action extends 'get' | 'update',
  T extends SettingsEntity,
  K extends (Action extends 'update' ? SettingsKey<T> : never) = never
> = {
  get: GetSettingsParams<T>;
  update: UpdateSettingsParams<T, K>;
}[Action];
