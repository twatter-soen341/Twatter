import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Notification} from '../models/notification.model';
import {NotificationAction} from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private readonly BASE_URL = `${environment.baseUrl}/notification`;
  constructor(private http: HttpClient) {
  }

  notify(emitterId: string, userId: string, type: NotificationAction, postID?: string) {
    const notification: Notification = {
      timeStamp: new Date(),
      targetID: userId,
      notifierID: emitterId,
      action: type,
      postID: (postID) ? postID : null
    };
    this.http.post(this.BASE_URL, notification);
  }

}


export enum NotificationType {
  LIKE,
  FOLLOW,
  COMMENT
}
