import { Settings, UseCase } from "../entities";
import { SettingsServicePort } from "../ports";
import { SettingsEntity, SettingsParams, SettingsType } from "../schemas";


export class GetEntitySettings<T extends SettingsEntity> 
  implements UseCase<SettingsParams<T>, Settings<T>[]> {
  
  constructor(private settingsService: SettingsServicePort) {}

  async execute(params: SettingsParams<T>): Promise<Settings<T>[]> {
    return this.settingsService.getAll(params.entityType, params.entityId);
  }
}
