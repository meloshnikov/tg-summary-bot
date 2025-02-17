import { UseCase } from "../entities";
import { SettingsServicePort } from "../ports";
import { SettingsEntity, SettingsKey, SettingsParams } from "../schemas";


export class UpdateEntityiSetting<T extends SettingsEntity, K extends SettingsKey<T>> 
  implements UseCase<SettingsParams<'update', T, K>, void> {
  
  constructor(private settingsService: SettingsServicePort) {}

  async execute(params: SettingsParams<'update', T, K>): Promise<void> {
    await this.settingsService.set(
      params.entityType,
      params.entityId,
      params.key,
      params.value,
      params.modifiedBy
    );
  }
}
