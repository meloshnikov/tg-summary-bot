export class Message {
  constructor(
    public readonly date: number,
    public readonly userId: number,
    public readonly chatId: number,
    public readonly text: string,
    public readonly expirationDate?: number,
  ) {}

  withExpiration(expirationDate: number): Message {
    return new Message(
      this.date,
      this.userId,
      this.chatId,
      this.text,
      expirationDate,
    );
  }

  updateText(text: string): Message {
    return new Message(
      this.date,
      this.userId,
      this.chatId,
      text,
      this.expirationDate,
    );
  }
};
