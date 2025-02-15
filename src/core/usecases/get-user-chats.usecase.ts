import { UseCase, UserChat } from "../entities";
import { MessageRepositoryPort } from "../ports";


export class GetUserChats implements UseCase<number, UserChat[]> {
  constructor(private messageRepo: MessageRepositoryPort) {}

  async execute(userId: number): Promise<UserChat[]> {
    return this.messageRepo.getUserChats(userId);
  }
}
