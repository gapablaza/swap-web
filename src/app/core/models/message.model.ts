export class Message {
  public archived?: boolean;
  public customTime?: string;
  public body: string;
  public fromUserId: number;
  public fromUserImage?: string;
  public fromUserName: string;
  public timestamp?: number;
  public toUserId: number;
  public toUserImage?: string;
  public toUserName: string;
  public unread?: boolean;

  constructor() {
    this.body = '';
    this.fromUserId = 0;
    this.fromUserName = '';
    this.toUserId = 0;
    this.toUserName = '';
  }
}
