import { UseCase } from "../entities";
import { MessageRepositoryPort } from "../ports";


export class DeleteExpiredMessages implements UseCase<void, number> {
  constructor(private readonly messageRepo: MessageRepositoryPort) {}


  async execute(): Promise<number> {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    return this.messageRepo.deleteMessagesOlderThan(currentTimestamp);
  }

}
