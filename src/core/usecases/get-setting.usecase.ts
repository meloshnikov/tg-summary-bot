import { UseCase } from "../entities";
import { SettingsEntity, SettingsKey, SettingsValueType } from "../schemas";
import { SettingsService } from "../services";

type Params<T extends SettingsEntity, K extends SettingsKey<T>> = {
  entityType: T;
  entityId: number;
  key: K;
};

export class GetSetting<T extends SettingsEntity, K extends SettingsKey<T>> 
  implements UseCase<Params<T, K>, SettingsValueType<T, K>> {
  
  constructor(private settingsService: SettingsService) {}

  async execute(params: Params<T, K>): Promise<SettingsValueType<T, K>> {
    return this.settingsService.get(params.entityType, params.entityId, params.key);
  }
}
