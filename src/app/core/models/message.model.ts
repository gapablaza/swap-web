export interface Message {
  archived?: boolean,
  customTime?: string,
  body: string,
  fromUserId: number,
  fromUserImage?: string,
  fromUserName: string,
  timestamp?: number,
  toUserId: number,
  toUserImage?: string,
  toUserName: string,
  unread?: boolean,
}
