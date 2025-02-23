import { TelegramBotPort } from "src/core/ports";
import { HandlerConfig, Markup } from "../types";

export const commands = (adapter: TelegramBotPort): HandlerConfig[] => [
  {
    type: 'command',
    name: 'settings',
    description: 'Управление настройками чата',
    handler: adapter.handleSettingsCommand,
  },
];


