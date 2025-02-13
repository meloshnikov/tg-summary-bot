export const SettingsSchema = {
  chat: {
    retention_days: 'number',
    llm_provider: 'string',
  },
} as const;

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
