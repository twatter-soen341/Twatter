import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AuthData, User } from 'src/app/models/auth.model';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  user: any;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.getUser().subscribe(data => {
      this.user = data.user;
    });
  }

  onLogout() {
    this.authService.logout();
  }

}
