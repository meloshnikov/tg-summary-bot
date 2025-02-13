import { UseCase } from "../entities";
import { SettingsEntity, SettingsKey, SettingsValueType } from "../schemas";
import { SettingsService } from "../services";

type Params<T extends SettingsEntity, K extends SettingsKey<T>> = {
  entityType: T;
  entityId: number;
  key: K;
  value: SettingsValueType<T, K>;
  modifiedBy?: number;
};

export class UpdateSetting<T extends SettingsEntity, K extends SettingsKey<T>> 
  implements UseCase<Params<T, K>, void> {
  
  constructor(private settingsService: SettingsService) {}

  async execute(params: Params<T, K>): Promise<void> {
    await this.settingsService.set(
      params.entityType,
      params.entityId,
      params.key,
      params.value,
      params.modifiedBy
    );
  }
}
