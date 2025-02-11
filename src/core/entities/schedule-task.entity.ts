import { UseCaseFactory } from "../usecases";

export type ScheduledTask = {
  cronPattern: string;
  useCaseName: keyof UseCaseFactory;
};
