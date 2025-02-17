import { TelegramBotPort } from "src/core/ports";
import { Context, HandlerConfig, Markup, Shorthand } from "../types";
import { CallbackQuery, Update } from "telegraf/typings/core/types/typegram";
import { Settings } from "src/core/entities";

import { SettingsSchemaKeys as SettingKeys } from "src/core/schemas";
import { parseSettingsParams } from "../tools";

export const actions = (adapter: TelegramBotPort): HandlerConfig[] => {

  const handleChatSelectCommand = createChatSelectHandler(adapter);

  return [
    {
      type: 'action',
      pattern: 'retry-settings',
      description: 'Повторный запрос настроек',
      handler: async (ctx) => {
        await ctx.answerCbQuery();
        await adapter.handleSettingsCommand(ctx);
      }
    },
    {
      type: 'action',
      pattern: /^chat_select:/,
      description: 'Выбор чата для отображения настроек',
      params: (chatId) => ({ chatId: Number(chatId) }),
      handler: async (ctx) => {
        await ctx.answerCbQuery();
        await handleChatSelectCommand(ctx);
      }
    },
    {
      type: 'action',
      pattern: /^setting_select:/,
      description: 'Выбор параметра для изменения',
      params: (chatId) => ({ chatId: Number(chatId) }),
      handler: async (ctx) => {
        await ctx.answerCbQuery();
        
        const callbackQuery = ctx.callbackQuery as CallbackQuery.DataQuery;
        const [_, entityType, entityId, key] = callbackQuery.data.split(':');
        const replay = getReplayBySetting(entityType, entityId, key);
        
        await ctx.reply(...replay);
      }
    },
    {
      type: 'action',
      pattern: /^set_setting:/,
      description: 'Установка нового значения для выбранного параметра',
      params: (chatId) => ({ chatId: Number(chatId) }),
      handler: async (ctx) => {
        await ctx.answerCbQuery();
        const { entityType, entityId, key, value } = parseSettingsParams(ctx);
        
        const updateEntitySetting = adapter.useCaseFactory.getUpdateEntitySetting();
        await updateEntitySetting.execute({ entityType, entityId, key, value });
        await handleChatSelectCommand(ctx)
      }
    },
  ];
};


const createChatSelectHandler = (adapter: TelegramBotPort) => {
  return async (ctx: Context<Update>) => {
    const { entityType, entityId } = parseSettingsParams(ctx);

    const getEntitySettings = adapter.useCaseFactory.getEntitySettings();
    const settings = await getEntitySettings.execute({ entityType, entityId: entityId });
    const table = formatSettingsTable(settings);
  
    await ctx.reply(`<pre>Текущие настройки ${entityType}:\n\n${table}</pre>`, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          settings.map(({ key }) => ({
            text: key,
            callback_data: `setting_select:${entityType}:${entityId}:${key}`
          })),
          [Markup.button.callback('Назад', `chat_select:${entityType}:${entityId}`)]
        ]
      }
    });
  }
}

const formatSettingsTable = (settings: Settings<"chat">[]): string => {
  const columns = [
    { name: 'Параметр', getValue: (s: Settings<"chat">) => String(s.key) },
    { name: 'Значение', getValue: (s: Settings<"chat">) => String(s.value) },
    { name: 'Изменил', getValue: (s: Settings<"chat">) => String(s.lastModifiedBy) },
    { name: 'Время', getValue: (s: Settings<"chat">) => new Date(s.lastModifiedAt).toLocaleString() },
  ];

  const maxWidths = columns.map(col => {
    let max = col.name.length;
    settings.forEach(setting => {
      const value = col.getValue(setting);
      if (value.length > max) max = value.length;
    });
    return max;
  });

  const header = columns
    .map((col, i) => col.name.padEnd(maxWidths[i]))
    .join(' | ');

  const separator = maxWidths
    .map(width => '-'.repeat(width))
    .join('-+-');

  const rows = settings.map((setting) => columns
    .map((col, i) => col.getValue(setting).padEnd(maxWidths[i]))
    .join(' | ')
  );

  return [header, separator, ...rows].join('\n');
};


const getReplayBySetting = (entityType: string, entityId: string, setting: string): Shorthand<'sendMessage'> => {
  switch(setting) {

    case SettingKeys.retention_days:
      return [
        'Выберите новое значение хранения сообщений в днях',
        {
          reply_markup: Markup.inlineKeyboard([
            [1, 2, 3, 4, 5, 6, 7].map(count => 
              Markup.button.callback(
                `${count}д`, 
                `set_setting:${entityType}:${entityId}:${setting}:${count}`
              ),
            ),
            [Markup.button.callback('Назад', `chat_select:${entityType}:${entityId}`)]
          ]
          ).reply_markup
        }
      ] as const as Shorthand<'sendMessage'>;

    default:
      return ['Настройка не найдена'] as Shorthand<'sendMessage'>;
  }
};
