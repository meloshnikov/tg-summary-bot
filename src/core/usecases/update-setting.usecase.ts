import { UseCase } from "../entities";
import { SettingsService } from "../services";

type Params = {
  entityType: string;
  entityId: number;
  key: string;
  value: any;
  modifiedBy?: number;
};

export class UpdateSetting implements UseCase<Params> {
  constructor(private settingsService: SettingsService) {}

  async execute(params: Params): Promise<void> {
    await this.settingsService.set(
      params.entityType,
      params.entityId,
      params.key,
      params.value,
      params.modifiedBy
    );
  }
}
