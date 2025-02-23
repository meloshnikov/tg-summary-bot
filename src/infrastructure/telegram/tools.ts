import { SettingsEntity, SettingsKey, SettingsSchema, SettingsValueType } from "src/core/schemas";
import { CallbackQuery, Context } from "./types";


type SettingsParams<T extends SettingsEntity> = {
  entityType: T;
  entityId: number;
  key: SettingsKey<T>;
  value: SettingsValueType<T, SettingsKey<T>>;
};

export const parseSettingsParams = <T extends SettingsEntity>(ctx: Context, expectedEntityType?: T): SettingsParams<T> => {
  const callbackQuery = (ctx.callbackQuery as CallbackQuery.DataQuery);
  
  if (!callbackQuery?.data) {
    throw new Error('Invalid callback query data');
  }

  const parts = callbackQuery.data.split(':');

  const [_, type, id, settingKey, value] = parts;
  
  /* Валидация entityType */
  const entityType = type as T;
  if (expectedEntityType && entityType !== expectedEntityType) {
    throw new Error(`Unexpected entity type: ${entityType}`);
  }

  /* Преобразование и валидация entityId */
  const entityId = parseInt(id);
  if (isNaN(entityId)) {
    throw new Error(`Invalid entity ID: ${id}`);
  }

  const key = settingKey as SettingsKey<SettingsEntity>;

  const parsedValue = parseSettingValue(entityType, key, value);

  return {
    entityType,
    entityId,
    key: settingKey as SettingsKey<T>,
    value: parsedValue as SettingsValueType<T, SettingsKey<T>>
  };
};

const parseSettingValue = <T extends SettingsEntity, K extends SettingsKey<T>>(entityType: T, key: K, value: string): SettingsValueType<T, K> => {
  const valueType = SettingsSchema[entityType][key];
  
  switch (valueType) {
    case 'number':
      return Number(value) as SettingsValueType<T, K>;
    case 'object':
      return JSON.parse(value) as SettingsValueType<T, K>;
      // case 'boolean':
      //   return (value === 'true') as SettingsValueType<T, K>;
    default:
      return value as SettingsValueType<T, K>;
  }
};
