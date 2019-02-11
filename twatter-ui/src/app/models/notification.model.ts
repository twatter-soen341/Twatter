
export interface Notification {
  timeStamp: Date;
  targetID: string;
  notifierID: string;
  action: NotificationAction;
  postID: string;
}

export enum NotificationAction {
  COMMENT,
  LIKE,
  FOLLOW
}
