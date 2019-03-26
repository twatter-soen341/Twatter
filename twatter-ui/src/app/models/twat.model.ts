export interface Twat {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  timeStamp: string;
  content: string;
  likedBy: string[];
  comments: Comment[];
}

export interface ReturnedTwat {
  _id: string;
  user: {
    _id: string,
    firstName: string,
    lastName: string,
  };
  timeStamp: number;
  content: string;
  likedBy: string[];
  comments: Comment[];
}
