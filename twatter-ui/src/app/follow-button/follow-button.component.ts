import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-follow-button',
  templateUrl: './follow-button.component.html',
  styleUrls: ['./follow-button.component.scss']
})
export class FollowButtonComponent implements OnInit {
  private userFollow;
  private followingUser;
  private arrayOfFollowing : Array<String>;

  constructor(private userService:UserService, private router: Router) { 
    
  }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {
      this.arrayOfFollowing = user.following;
    });
  }

  isFollowing(){
    this.followingUser = this.router.url.split('/profile/')[1];
    return this.arrayOfFollowing.includes(this.followingUser);
  }

  toggleFollow() {
    this.userFollow = this.router.url.split('/profile/')[1];
    if(this.isFollowing()){
      this.userService.unfollowUser(this.userFollow);
    }else{
      this.userService.followUser(this.userFollow);
    }
  }

}
