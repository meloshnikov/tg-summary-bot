import { User } from "../entities";

export interface UserInfoProviderPort {
  getUsersInfo(chatId: number, userIds: number[]): Promise<User[]>;
}
