
import { tokenKey } from '@angular/core/src/view';
import { HttpBackend } from '@angular/common/http';

export interface Post {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  timeStamp: number;
  content: string;
}
