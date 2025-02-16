import { TelegramBotPort } from "src/core/ports";
import { HandlerConfig } from "./types";
import { CallbackQuery, Update } from "telegraf/typings/core/types/typegram";
import { Settings } from "src/core/entities";
import { Context } from "telegraf";

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
        
        const callbackQuery = ctx.callbackQuery as CallbackQuery.DataQuery;
        const chatId = Number(callbackQuery.data.split(':')[1]);
        
        await handleChatSelectCommand(ctx, chatId);
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
        const setting = callbackQuery.data.split(':')[1];
        
        await ctx.reply('Ты че Баклажан думаешь просто так можешь менять любые параметры?!');
      }
    }
  ];
};


const createChatSelectHandler = (adapter: TelegramBotPort) => {
  return async (ctx: Context<Update>, chatId: number) => {
    const getEntitySettings = adapter.useCaseFactory.getEntitySettings();
    const settings = await getEntitySettings.execute({ entityType: 'chat', entityId: chatId });
    const table = formatSettingsTable(settings);
  
    await ctx.reply(`<pre>Текущие настройки чата:\n\n${table}</pre>`, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          settings.map(({ key }) => ({
            text: key,
            callback_data: `setting_select:${key}`
          }))
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
