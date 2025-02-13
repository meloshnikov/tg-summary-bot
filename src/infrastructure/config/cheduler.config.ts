import { ScheduledTask } from "src/core/entities";

const EVERY_DAY_AT_MIDNIGHT = '0 0 * * *';

export const SCHEDULED_TASKS: ScheduledTask[] = [
  { cronPattern: EVERY_DAY_AT_MIDNIGHT, useCaseName: 'getDeleteExpiredMessages' },
];
