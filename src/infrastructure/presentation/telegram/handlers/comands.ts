import { TelegramBotPort } from "src/core/ports";
import { HandlerConfig } from "./types";

export const commands = (adapter: TelegramBotPort): HandlerConfig[] => [
  {
    type: 'command',
    name: 'settings',
    description: 'Управление настройками чата',
    handler: adapter.handleSettingsCommand,
  }
];


