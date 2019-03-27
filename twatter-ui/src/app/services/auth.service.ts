import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {UserData, AuthData, TokenData, User} from '../models/auth.model';
import {Router} from '@angular/router';
import {Subject, Observable} from 'rxjs';

const BASE_URL = `${environment.baseUrl}/auth`;

@Injectable({
  providedIn: 'root'
})
/**
 * This class is used to make authentication Http Requests
 * ie. to signup, login, logout
 */
export class AuthService {
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private isAuthenticated = false;
  private authListener = new Subject<boolean>();

  constructor(private router: Router, private httpClient: HttpClient) {
  }

  /**
   * @returns the current user's token
   */
  getToken(): string {
    return this.token;
  }

  /**
   * @returns the current user's ID.
   */
  getUserId(): string {
    return this.userId;
  }

  /**
   * This observable is useful to use in components to keep it updated with
   * the users authorization state. ie. is the user logged in or logged out?
   * Should be used in the component's OnInit life cycle hook.
   * @returns an observable to listen to any changes to the authentication
   */
  getAuthListener(): Observable<boolean> {
    return this.authListener.asObservable();
  }

  /**
   * @returns if the user is currently logged in or out.
   */
  isUserAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  /**
   * This function will call the service to create a new user
   * and persist them to the database.
   * @param firstName user's first name
   * @param lastName user's last name
   * @param email user's email address (must be unique)
   * @param password user's password
   * After a successful response from the server, the client
   * will be redirected to the login page.
   * Should be used in the signup component.
   */
  signup(firstName: string, lastName: string, email: string, password: string) {
    const userData: UserData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    };
    /* If the user account was created, navigate to the login page */
    this.httpClient.post(`${BASE_URL}/signup`, userData).subscribe(
      () => {
        this.router.navigate(['/login']);
      },
      err => {
        console.log(err);
      }
    );
  }

  /**
   * This function will call the service to authenticate a
   * user. If the backend response is sucessful, It will
   * update this classe's varibles to confirm the user is logged in.
   * Then it will store the authentication data inside local
   * storage so that the user will still be logged in after
   * refreshing the page. The token expires in 1h, so this method
   * also starts a timer that will automatically log the user out
   * after the token is expired.
   * @param email user email
   * @param password user password
   * Once the function finishes sucessfully, the user is
   * redirected to the root page(for now).
   * Should be used in the login component
   */
  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };

    return this.httpClient
      .post<{ token: string; expiresIn: number; userId: string }>(
        `${BASE_URL}/login`,
        authData
      );
  }

  setToken(data) {
    const token = data.token;
    this.setAuthenticated(token, data.userId);
    /* Get the expiration date */
    const expirationDate = this.getExpirationDate(data.expiresIn);
    /* Save the data in localStorage */
    this.saveAuthData(token, this.userId, expirationDate);
    /* start the timer to logout */
    this.tokenTimer = this.setTokenTimer(data.expiresIn * 1000);
  }

  /**
   * This method will log a current user out but clearing
   * the local storage and setting authenticatioin values
   * to false. It also clears the logout timeout set once a
   * user logs in. Finally, it redirects the user to the login
   * page.
   * Should be used when user clicks the logout button in the nav bar.
   */
  logout() {
    /* Clearing all user data */
    this.isAuthenticated = false;
    this.userId = null;
    this.token = null;
    this.authListener.next(false);
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
    /* redirecting to login page */
    this.router.navigate(['/login']);
  }

  /**
   * This method will check the client's local storage.
   * Must be used in the app component OnInit() so that it
   * checks to see if the the user is logged in from any component.
   *
   * If the user has valid token that is not expired yet, it
   * will log in the user and set the log out timer to the
   * appropriate time.
   *
   * Is used in the app component, therefore every component automatically
   */
  resumeSession() {
    const loggedInUser: TokenData = this.getAuthData();

    /* Check to see if there is already a user logged in */
    if (!loggedInUser) {
      return;
    }

    /* Check to see if jwt has expired */
    const timeNow = new Date().getTime();
    const timeAtExpire = new Date(loggedInUser.expirationDate).getTime();
    const timeLeft = timeAtExpire - timeNow; // in ms

    /* if its expired, exit */
    if (timeLeft <= 0) {
      return;
    } else {
      this.setAuthenticated(loggedInUser.token, loggedInUser.userId);
      this.setTokenTimer(timeLeft);
    }
  }

  /* HELPER FUNCTIONS */
  private setAuthenticated(token: string, userId: string) {
    /* Update the authentication values */
    this.token = token;
    this.isAuthenticated = true;
    this.authListener.next(true);
    /* Get the id of the user logging in */
    this.userId = userId;
  }

  private setTokenTimer(timeLeft: number) {
    /* after the timer expires, user will be logged out automatically */
    setTimeout(() => this.logout(), timeLeft);
  }

  private getExpirationDate(seconds: number) {
    const milliseconds = seconds * 1000;
    const timeNow = new Date().getTime();
    return new Date(timeNow + milliseconds);
  }

  /* Saving the auth data to the local storage */
  private saveAuthData(token: string, userId: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
  }

  /* get the data from local storage */
  private getAuthData(): TokenData {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const expirationDate = localStorage.getItem('expirationDate');

    /* if theres no token or token is expired, return nothing */
    if (!token || !expirationDate) {
      return;
    }

    return {
      token: token,
      userId: userId,
      expirationDate: new Date(expirationDate)
    };
  }

  /* Removing the auth data from the local storage */
  private clearAuthData() {
    localStorage.clear();
  }

  /* To update the email of a user */
  updateUserEmail(email: string, password: string, userID: string) {

    const emailData: any = {
      id : userID,
      newEmail: email,
      password: password
    };
    return this.httpClient.put(`${BASE_URL}/email/`, emailData);
  }

  /* To update the password of a user */
  updateUserPassword(email: string, currentPassword: string, newPassword: string) {
    const passwordData: any = {
      email: email,
      password: currentPassword,
      newPassword: newPassword
    };
    return this.httpClient.put(`${BASE_URL}/pass/`, passwordData);
  }

  /* To delete the account of a user */
  deleteAccount(password: string, email: string) {
    const deleteData: any = {
      email: email,
      password: password
    };
    return this.httpClient.request('delete', `${BASE_URL}`, { body: deleteData });
  }
}
