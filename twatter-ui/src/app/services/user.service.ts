import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';

const BASE_URL = `${environment.baseUrl}/user`;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getCurrentUser() {
    const userId = this.authService.getUserId();
    return this.http.get<any>(`${BASE_URL}/search/${userId}`);
  }

  updateUserNames(firstName: string, lastName: string) {
    // TODO: To recheck that
    // this.http.put(`${BASE_URL}/update/`);
  }

  searchUser(name: string) {
    const query = { search: name };
    console.log(`searchUser calling api with %c${name}`, 'font-weight:bold');
    return this.http.post<any>(`${BASE_URL}/search`, query);
  }

  getUsersNames(names: string[]): any {
    const body = {ids: names};
    return this.http.post<any>(`${BASE_URL}/users`, body);
  }

  updateFollowers(idToFollow:string){
    const body = {
      user_id:this.authService.getUserId(),
      wantToFollow: idToFollow
    }
    return this.http.put(`${BASE_URL}/follow-user`, body);
  }

  getUserWithId(id: string) {
    return this.http.get<any>(`${BASE_URL}/search/${id}`);
  }
}
