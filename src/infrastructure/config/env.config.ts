import dotenv from 'dotenv';
import { ProcessEnvKeys } from 'src/shared';

class EnvConfig {
  private static instance: EnvConfig;
  private envVariables: NodeJS.ProcessEnv;

  private constructor() {
    dotenv.config();
    this.envVariables = process.env;
  }

  public static getInstance(): EnvConfig {
    if (!EnvConfig.instance) {
      EnvConfig.instance = new EnvConfig();
    }
    return EnvConfig.instance;
  }

  public get(key: ProcessEnvKeys): string {
    const value = this.envVariables[key];
    if (value === undefined) {
      throw new Error(`Environment variable \${key} is not set`);
    }
    return value;
  }
}

export const envConfig = EnvConfig.getInstance();
