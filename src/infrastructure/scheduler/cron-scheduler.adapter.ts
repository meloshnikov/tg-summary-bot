import { CronJob } from 'cron';
import { ScheduledTask } from 'src/core/entities';
import { SchedulerPort, UseCaseFactoryPort } from 'src/core/ports';


export class CronSchedulerAdapter implements SchedulerPort {
  private jobs: CronJob[] = []

  constructor(
    private useCaseFactory: UseCaseFactoryPort,
    private tasks: ScheduledTask[],
  ) {}

  schedule(task: ScheduledTask): void {
    const job = new CronJob(
      task.cronPattern,
      async () => {
        try {
          const useCase = this.useCaseFactory[task.useCaseName]();
          await useCase.execute();
        } catch (error) {
          console.error(`Task ${task.useCaseName} failed:`, error);
        }
      }
    );
    this.jobs.push(job);
  }

  start(): void {
    this.tasks.forEach(task => this.schedule(task));
    this.jobs.forEach(job => job.start());
  }
}
