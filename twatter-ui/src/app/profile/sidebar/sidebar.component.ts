import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  firstName = '';
  lastName = '';

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {
      this.firstName = user.firstName;
      this.lastName = user.lastName;
    });
  }

}
