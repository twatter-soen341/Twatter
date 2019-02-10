import {Component, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  firstName = '';

  constructor(private userService: UserService, private authService: AuthService) {
  }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {
      this.firstName = user.firstName;
    });
  }

  onLogout() {
    this.authService.logout();
  }

  // Brings Back To Top
  bringsBackToTop() {
    window.scroll(0, 0);
  }

  changeThemeToDarkMode() {

  }

  changeThemeToLightMode() {

  }
}
