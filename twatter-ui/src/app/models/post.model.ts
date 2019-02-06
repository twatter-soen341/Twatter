import { createReadStream } from 'fs';
import { tokenKey } from '@angular/core/src/view';
import { HttpBackend } from '@angular/common/http';

export interface Post {
  userID: string;
  firstName: string;
  lastName: string;
  timeStamp: Date;
  content: string;
}
