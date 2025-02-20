import { SettingsType } from "src/core/schemas/settings-schema";

export const DefaultSettingsConfig: SettingsType = {
  chat: {
    retention_days: 7,
    llm_provider: 'google',
    encrypted_key: '',
  },
};
