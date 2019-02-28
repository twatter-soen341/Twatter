import {Component, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {AuthService} from '../services/auth.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  firstName = '';
  userId = '';
  private notificationCount: number;
  protected notifications: string[];
  protected colourForIcons = 'white';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {
      this.firstName = user.firstName;
    });
    this.userService.getCurrentUser().subscribe(user => {
      this.userId = user._id;
    });
    this.notifications = new Array();
    this.notificationCount = this.notifications.length;
  }

  onLogout() {
    this.authService.logout();
  }

  goToProfile() {
    this.router.navigate(['/profile', this.userId]);
  }

  // Brings Back To Top
  bringsBackToTop() {
    window.scroll(0, 0);
  }

  // TO DO: Implement in future sprints
  changeThemeToDarkMode() {

  }

  // TO DO: Implement in future sprints
  changeThemeToLightMode() {

  }

  // The function to test notifications
  testNotifications() {
    this.notifications.push('Testing Test 1');
    this.notifications.push('Testing Test 2');
    this.notifications.push('Testing Test Tesdy Tesdt 3');
    // this.notifications.push('Testing Test 4');
    this.notificationCount = this.notifications.length;
  }

  // function which adds notifications
  addNotification(notification: string) {
    this.notifications.push(notification);
    this.notificationCount = this.notifications.length;
  }

  // Function which clears all the notifications
  clearNotifications() {
    while (this.notifications.length !== 0) {
      this.notifications.pop();
    }
    this.notificationCount = this.notifications.length;
  }
}
