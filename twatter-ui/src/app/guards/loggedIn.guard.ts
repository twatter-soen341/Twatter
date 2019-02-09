import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    /* Check if user is already logged in */
    const userLoggedIn = this.authService.isUserAuthenticated();

    /* if the user is already logged in, redirecting to the home page */
    if (userLoggedIn) {
      this.router.navigate(['/']);
    }

    /* return true, can activate the route since it is needed to log in */
    return !userLoggedIn;
  }
}
