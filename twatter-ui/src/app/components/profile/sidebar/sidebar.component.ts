import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/auth.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TwatsService } from 'src/app/services/twat.service';

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

  editMode = false;
  bio: string;
  showFollowBtn = false;

  @Input() totalLikes;
  twatterAge: string;

  followerList$: Observable<any>;
  followingList$: Observable<any>;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private twatsService: TwatsService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = params['id'];

      this.userService.getUserWithId(this.userId).subscribe(user => {
        this.user = user;

        this.userService.getCurrentUser().subscribe(cUser => {
          this.loggedUser = cUser._id;
          this.twatterAge = this.getTwatterAge(user.dateCreated);
          this.showFollowBtn = false;

          if (this.userId !== this.loggedUser) {
            this.showFollowBtn = true;
          } else {
            this.showFollowBtn = false;
          }
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
      this.editMode = false;
    });
  }
  cancelBio() {
    this.editMode = false;
    this.bio = this.user.bio;
  }

  // Navigates to a page where user can see most recent posts of user's followers.
  seeFollowersPost() {
    this.router.navigate([`/followers/${this.loggedUser}`]);
  }

  private getTwatterAge(dateCreated: number): string {
    /* Getting the number of seconds between date created and now */
    const seconds = (Date.now() - dateCreated) / 1000;
    let twatterAge: string;

    let interval = Math.floor(seconds);
    /* If more than 1 sec, display it */
    if (interval >= 1) {
      twatterAge = interval + ' sec';
    }

    /* Dividing by number of sec in a min to get number of days since creation */
    interval = Math.floor(seconds / 60);
    /* If more than 1 min, display it */
    if (interval >= 1) {
      twatterAge = interval + ' min';
    }

    /* Dividing by number of sec in a hour to get number of days since creation */
    interval = Math.floor(seconds / 3600);
    /* If more than 1 hour, display it */
    if (interval >= 1) {
      twatterAge = interval + ' h';
    }

    /* Dividing by number of sec in a day to get number of days since creation */
    interval = Math.floor(seconds / 86400);
    /* If more than 1 day, display it */
    if (interval >= 1) {
      twatterAge = interval + ' d';
    }

    /* Dividing by number of sec in a month to get number of months since creation */
    interval = Math.floor(seconds / 2592000);
    /* If more than 1 month, display it */
    if (interval >= 1) {
      twatterAge = interval + ' m';
    }

    /* Dividing by number of sec in a year to get number of years since creation */
    interval = Math.floor(seconds / 31536000);
    /* If more than 1 year, display it */
    if (interval >= 1) {
      console.log(twatterAge);
      twatterAge = interval + ' y';
    }

    return twatterAge;
  }
}
