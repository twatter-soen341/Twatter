import { Component, OnInit, Output } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { User } from '../models/auth.model';
import { stringify } from '@angular/core/src/util';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-follow-button',
  templateUrl: './follow-button.component.html',
  styleUrls: ['./follow-button.component.scss']
})
export class FollowButtonComponent implements OnInit {
  private userToFollow;
  private user: User;
  private userId: string;
  public btnText = 'Follow';
  private followed: boolean;


  constructor(private userService:UserService, private router: Router) {

  }

  ngOnInit() {
    // get user's id
    this.userService.getCurrentUser()
      .subscribe(user => {
        this.user = user;
        this.userId = user._id;

        // get id of user to follow
        this.userToFollow = this.router.url.split('/profile/')[1];

        this.alreadyFollowing();
    });
  }

  // Check if initially followed and update button
  alreadyFollowing() {
    this.userService.getFollowers(this.userToFollow).subscribe(data => {
      try {
        for ( const user of data.followers ) {
          if (user.id === this.user.id) {
            this.btnText = 'Unfollow';
            this.followed = true;
          } else {
            this.btnText = 'Follow';
            this.followed = false;
          }
        }
      } catch (error) {
        console.log(data.message);
        this.followed = false;
      }
    });
  }

  // follow/unfollow and update button
  toggleFollow() {
    if (this.followed) {
      this.btnText = 'Follow';
      this.followed = false;
      this.userService.unfollowUser(this.userToFollow);
    } else {
      this.btnText = 'Unfollow';
      this.followed = true;
      this.userService.followUser(this.userToFollow);
    }
  }
}