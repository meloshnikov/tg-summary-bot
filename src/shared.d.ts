
interface ProcessEnv {
  TELEGRAM_BOT_TOKEN: string;
  GEMINI_API_KEY: string;
  OPENAI_API_KEY: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_HOST: string;
  DB_PORT: string;
  MKV_HOST: string;
  MKV_API_TOKEN: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends ProcessEnv {}
  }
}

export type ProcessEnvKeys = keyof ProcessEnv;

export {};
