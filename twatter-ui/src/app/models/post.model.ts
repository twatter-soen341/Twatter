export interface Post {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  timeStamp: string;
  content: string;
  likes: [string];
}
