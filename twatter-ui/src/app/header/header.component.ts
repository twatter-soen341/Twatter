import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  firstName = '';

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.getUser().subscribe(data => {
      this.firstName = data.user.firstName;
    });
  }

  onLogout() {
    this.authService.logout();
  }
}
