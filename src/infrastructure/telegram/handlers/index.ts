import { TelegramBotPort } from "src/core/ports";
import { middlewares } from "./middlewares";
import { commands } from "./comands";
import { actions } from "./actions";
import { hears } from "./hears";
import { HandlerConfig } from "../types";


export type HandlerModule = (adapter: TelegramBotPort) => HandlerConfig[];

export const configureHandlers = (adapter: TelegramBotPort): HandlerConfig[] => {
  const modules: HandlerModule[] = [
    middlewares,
    commands,
    actions,
    hears,
  ];

  return modules.flatMap((module) => module(adapter));
};
