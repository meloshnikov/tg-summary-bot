import "reflect-metadata";
import { DataSource } from "typeorm";
import { envConfig } from "../config/env.config";
import { MessageModel } from "./message-repository.model";
import { SettingsModel } from "./settings-repository.model";

export const createDatabase = () => new DataSource({
  type: "postgres",
  host: envConfig.get('DB_HOST'),
  port: parseInt(envConfig.get('DB_PORT')),
  username: envConfig.get('DB_USER'),
  password: envConfig.get('DB_PASSWORD'),
  database: envConfig.get('DB_NAME'),
  entities: [MessageModel, SettingsModel],
  synchronize: true,
});
