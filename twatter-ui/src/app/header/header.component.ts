import {Component, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  firstName = '';
  userId = '';
  protected colourForIcons = 'white';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {
      this.firstName = user.firstName;
    });
    this.userService.getCurrentUser().subscribe(user => {
      this.userId = user._id;
    });
  }

  onLogout() {
    this.authService.logout();
  }

  goToProfile() {
    this.router.navigate(['/profile', this.userId]);
  }
}
