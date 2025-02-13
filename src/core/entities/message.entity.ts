export class Message {
  constructor(
    public readonly userId: number,
    public readonly chatId: number,
    public readonly date: number,
    public readonly expirationDate?: number,
    public readonly firstName?: string,
    public readonly lastName?: string,
    public readonly username?: string,
    public readonly languageCode?: string,
    public readonly isPremium?: boolean,
    public readonly chatTitle?: string,
    public readonly chatType?: string,
    public readonly text?: string,
  ) {}

  withExpiration(expirationDate: number): Message {
    return new Message(
      this.userId,
      this.chatId,
      this.date,
      expirationDate,
      this.firstName,
      this.lastName,
      this.username,
      this.languageCode,
      this.isPremium,
      this.chatTitle,
      this.chatType,
      this.text
    );
  }
};
