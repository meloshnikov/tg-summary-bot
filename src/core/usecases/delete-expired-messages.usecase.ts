import { UseCase } from "../entities";
import { MessageRepositoryPort } from "../ports";


export class DeleteExpiredMessages implements UseCase {
  constructor(
    private readonly messageRepo: MessageRepositoryPort,
  ) {}

  async execute() {
    
    console.log('Сообщения успешно удалены');
  }

}
