import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-follow-button',
  templateUrl: './follow-button.component.html',
  styleUrls: ['./follow-button.component.scss']
})
export class FollowButtonComponent implements OnInit {
  alreadyFollowing: true;
  constructor(private userService:UserService) { }

  ngOnInit() {
  }

  toggleFollow() {
  }

}
