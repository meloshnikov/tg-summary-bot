import { Message } from "../entities";
import { MessageRepositoryPort } from "../ports";


export class SaveMessage {
  constructor(private readonly repository: MessageRepositoryPort) {}

  async execute(message: Message | null): Promise<void> {
    if (this.isValidMessage(message)) {
      await this.repository.saveMessage(message);
    }
  }

  private isValidMessage(message: Message | null): message is Message {
    if (message === null) return false;
    return Boolean(message.text?.length);
  }
}
