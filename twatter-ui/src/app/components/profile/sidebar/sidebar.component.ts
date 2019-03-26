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
    lastName: ''
  };
  loggedUser: string;
  twatterAge: string;
  followerList$: Observable<any>;
  followingList$: Observable<any>;
  @Input () totalLikes;

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

          this.twatterAge = this.getTwatterAge(new Date(cUser.dateCreated).valueOf());

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

  /**
   * Navigates to a page where user can see most recent posts
   * of user's followers.
   */
  seeFollowersPost() {
    this.router.navigate([`/followers/${this.loggedUser}`]);
  }

  /**
   * This method returns a human readable string that contains the
   * number of years, months, days, hours and minutes its input parameter
   * @param dateCreated
   * @returns string
   */
  getTwatterAge(dateCreated: number): string {
    /* Getting the number of seconds between date created and now */
    let seconds = (Date.now() - dateCreated) / 1000;
    let twatterAge: string;

    /* Dividing by number of seconds in a year to get number of years since creation */
    let interval = Math.floor(seconds / 31536000);

    /* If more than 1 year, display it */
    if (interval > 1) {
      twatterAge = interval + ' years';
      seconds -= 31536000 * interval;
    }

    /* Dividing by number of seconds in a month to get number of months since creation */
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      twatterAge = !twatterAge
        ? twatterAge + ' ' + interval + ' months'
        : interval + ' months';
      seconds -= 2592000 * interval;
    }

    /* Dividing by number of days in a year to get number of days since creation */
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      twatterAge = !twatterAge
        ? twatterAge + ' ' + interval + ' days'
        : interval + ' days';
      seconds -= 86400 * interval;
    }

    /* Dividing by number of seconds in a hour to get number of hours since creation */
    interval = Math.floor(seconds / 3600);
    if (interval > 1 && !twatterAge) {
      twatterAge = interval + ' hours';
      seconds -= 3600 * interval;
    }

    /* Dividing by number of miin in a year to get number of min since creation */
    interval = Math.floor(seconds / 60);
    if (interval > 1 && !twatterAge) {
      twatterAge = interval + ' min';
    } else if(!twatterAge) {
      twatterAge = '0 min';
    }
    return twatterAge;
  }
}
