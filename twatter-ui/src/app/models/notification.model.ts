
export interface Notification {
  timeStamp: Date;
  targetID: string;
  notifierID: string;
  action: NotificationAction;
  postID: string;
}
