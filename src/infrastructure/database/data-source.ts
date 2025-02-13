import "reflect-metadata";
import { DataSource } from "typeorm";
import { envConfig } from "../config/env.config";
import { Messages } from "./message-repository.model";
import { Settings } from "./settings-repository.model";

export const createDatabase = () => new DataSource({
  type: "postgres",
  host: envConfig.get('DB_HOST'),
  port: parseInt(envConfig.get('DB_PORT')),
  username: envConfig.get('DB_USER'),
  password: envConfig.get('DB_PASSWORD'),
  database: envConfig.get('DB_NAME'),
  entities: [Messages, Settings],
  synchronize: true,
});
