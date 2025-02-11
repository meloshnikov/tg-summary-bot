import { ScheduledTask } from "../entities";

export interface SchedulerPort {
  schedule(task: ScheduledTask): void;
  start(): void;
}
