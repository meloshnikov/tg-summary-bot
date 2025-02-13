import { UseCase } from "../entities";
import { SettingsService } from "../services";

type Params = {
  entityType: string;
  entityId: number;
  key: string;
};

export class GetSetting implements UseCase<Params, any> {
  constructor(private settingsService: SettingsService) {}

  async execute(params: Params): Promise<any> {
    return this.settingsService.get(params.entityType, params.entityId, params.key);
  }
}
