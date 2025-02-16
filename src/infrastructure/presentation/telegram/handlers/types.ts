import { Context, Middleware } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";

export type HandlerConfig = 
  | CommandConfig
  | ActionConfig
  | HearsConfig
  | MiddlewareConfig;

type HandlerCategory = 'middleware' | 'command' | 'action' | 'hears';

interface BaseHandlerConfig<T extends HandlerCategory> {
  type: T;
}

export interface CommandConfig extends BaseHandlerConfig<'command'> {
  name: string;
  description?: string;
  handler: (ctx: Context<Update>) => Promise<void>;
}

export interface ActionConfig extends BaseHandlerConfig<'action'> {
  pattern: RegExp | string;
  description?: string;
  params?: (...matches: string[]) => Record<string, unknown>;
  handler: (ctx: Context<Update>) => Promise<void>;
}

export interface HearsConfig extends BaseHandlerConfig<'hears'> {
  pattern: RegExp;
  description?: string;
  handler: (ctx: Context<Update>) => Promise<void>;
}

export interface MiddlewareConfig extends BaseHandlerConfig<'middleware'> {
  handler: Middleware<Context<Update>>;
}
