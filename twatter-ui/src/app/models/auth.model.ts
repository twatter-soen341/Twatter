export interface AuthData {
  email: string;
  password: string;
}

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface TokenData {
  token: string;
  userId: string;
  expirationDate: Date;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  bio: string;
  email: string;
  followers: Array<User>;
  following: Array<User>;
}
