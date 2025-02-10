export class Message {
  constructor(
    public readonly userId: number,
    public readonly firstName?: string,
    public readonly lastName?: string,
    public readonly username?: string,
    public readonly languageCode?: string,
    public readonly isPremium?: boolean,
    public readonly chatId?: number,
    public readonly chatTitle?: string,
    public readonly chatType?: string,
    public readonly date?: number,
    public readonly text?: string,
  ) {}
};
