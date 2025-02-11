
import { Message, UseCase } from "../entities";

export interface UseCaseFactoryPort {
  getGenerateReport(): UseCase<number, string>;
  getSaveMessage(): UseCase<Message | null, void>;
  deleteExpiredMessages(): UseCase<void, void>;
}
