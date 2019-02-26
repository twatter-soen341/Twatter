import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

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

  searchUser(name: string) {
    const query = { search: name };
    console.log(`searchUser calling api with %c${name}`, 'font-weight:bold');
    return this.http.post<any>(`${BASE_URL}/search`, query);
  }

  getUsersNames(names: string[]): any{
    const body = {ids: names};
    return this.http.post<any>(`${BASE_URL}/users`, body);
  }
}
