import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-follow-button',
  templateUrl: './follow-button.component.html',
  styleUrls: ['./follow-button.component.scss']
})
export class FollowButtonComponent implements OnInit {
  private userToFollow;

  constructor(private userService:UserService, private router: Router) { 
    
  }

  ngOnInit() {
  }

  alreadyFollowing(){
    return false; //TODO: check if current user has his.router.url.split('/profile/')[1]; as id inside his following
  }

  toggleFollow() {
    this.userToFollow = this.router.url.split('/profile/')[1];
    this.userService.followUser(this.userToFollow);
  }

}
