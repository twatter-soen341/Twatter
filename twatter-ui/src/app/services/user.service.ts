import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';
import {User} from '../models/auth.model';

const BASE_URL = `${environment.baseUrl}/user`;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getCurrentUser() {
    const userId = this.authService.getUserId();
    return this.http.get<any>(`${BASE_URL}/search/${userId}`);
  }

  updateUserNames(newFirstName: string, newLastName: string) {
    const userID = this.authService.getUserId();
    const body = {
      firstName: newFirstName,
      .put(`${BASE_URL}/users/${userID}`, body);

  searchUser(name: string) {
    const query = {search: name};
    console.log(`searchUser calling api with %c${name}`, 'font-weight:bold');
    return this.http.post<any>(`${BASE_URL}/search`, query);
  }

  getUsersNames(names: string[]): any {
    const body = {ids: names};
    return this.http.post<any>(`${BASE_URL}/users`, body);
  }

  followUser(idToFollow: string) {
    // const headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    const body = {
      user_id: this.authService.getUserId(),
      wantToFollow: idToFollow,
    };
    return this.http
      .put(`${BASE_URL}/follow-user`, body)
      .subscribe(res => console.log(res));
  }

  unfollowUser(id: string) {
    const body = {
      user_id: this.authService.getUserId(),
      wantToUnFollow: id,
    };
    return this.http.put(`${BASE_URL}/unfollow-user/${id}`, body).subscribe(res => console.log(res));
  }

  getFollowers(id: string) {
    return this.http.get<{ message: string, followers: User[] }>(`${BASE_URL}/followers/${id}`);
  }

  getFollowing(id: string) {
    return this.http.get<any>(`${BASE_URL}/following/${id}`);
  }

  getUserWithId(id: string) {
    return this.http.get<any>(`${BASE_URL}/search/${id}`);
  }
}
