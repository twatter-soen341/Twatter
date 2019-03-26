import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/auth.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TwatsService } from 'src/app/services/twat.service';
import { TooltipPosition } from '@angular/material';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  userId: string;
  user = {
    firstName: '',
    lastName: '',
    bio: ''
  };
  loggedUser: string;
  
  tooltipPosition: TooltipPosition = 'right';
  editMode = false;
  bio: string;
  
  @Input() totalLikes;
  twatterAge: string;

  followerList$: Observable<any>;
  followingList$: Observable<any>;
  
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private twatsService: TwatsService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = params['id'];

      this.userService.getUserWithId(this.userId).subscribe(user => {
        this.user = user;

        this.userService.getCurrentUser().subscribe(cUser => {
          this.loggedUser = cUser._id;
          this.twatterAge = this.getTwatterAge(cUser.dateCreated);
        });
      });

      // Retrieve list of current user's followers
      this.userService.getFollowers(this.userId).subscribe(user => {
        this.followerList$ = user.followers;
      });

      // Retrieve list of people that user is following
      this.userService.getFollowing(this.userId).subscribe(user => {
        this.followingList$ = user.following;
      });
    });
  }

  editBio() {
    this.bio = this.user.bio;
    this.editMode = true;
  }
  saveBio() {
    this.user.bio = this.bio;
    this.userService.updateBio(this.user).subscribe(res => {
      console.log(res);
      this.editMode = false;
    });
  }
  cancelBio() {
    this.editMode = false;
    this.bio = this.user.bio;
  }

  /**
   * Navigates to a page where user can see most recent posts
   * of user's followers.
   */
  seeFollowersPost() {
    this.router.navigate([`/followers/${this.loggedUser}`]);
  }

  /**
   * returns a human readable string that contains the
   * number of years, months, days, hours and minutes its input parameter
   * @param dateCreated
   * @returns string
   */
  private getTwatterAge(dateCreated: number): string {
    /* Getting the number of seconds between date created and now */
    const seconds = (Date.now() - dateCreated) / 1000;
    let twatterAge: string;

    let interval = Math.floor(seconds);
    /* If more than 1 sec, display it */
    if (interval > 1) {
      twatterAge = interval + ' sec';
    }

    /* Dividing by number of sec in a min to get number of days since creation */
    interval = Math.floor(seconds / 60);
    /* If more than 1 min, display it */
    if (interval > 1) {
      twatterAge = interval + ' min';
    }

    /* Dividing by number of sec in a hour to get number of days since creation */
    interval = Math.floor(seconds / 3600);
    /* If more than 1 hour, display it */
    if (interval > 1) {
      twatterAge = interval + ' hours';
    }

    /* Dividing by number of sec in a day to get number of days since creation */
    interval = Math.floor(seconds / 86400);
    /* If more than 1 day, display it */
    if (interval > 1) {
      twatterAge = interval + ' days';
    }

    /* Dividing by number of sec in a month to get number of months since creation */
    interval = Math.floor(seconds / 2592000);
    /* If more than 1 month, display it */
    if (interval > 1) {
      twatterAge =  interval + ' months';
    }

    /* Dividing by number of sec in a year to get number of years since creation */
    interval = Math.floor(seconds / 31536000);
    /* If more than 1 year, display it */
    if (interval > 1) {
      console.log(twatterAge);
      twatterAge = interval + ' years';
    }

    return twatterAge;
  }
}
