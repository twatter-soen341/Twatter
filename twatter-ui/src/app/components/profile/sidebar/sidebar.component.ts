import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/auth.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


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
  followerList$: Observable<any>;
  followingList$: Observable<any>;

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = params['id'];

      this.userService.getUserWithId(this.userId).subscribe(user => {
        this.user = user;

        this.userService.getCurrentUser().subscribe(cUser => {
          this.loggedUser = cUser._id;
        });
      });

      //Retrieve list of current user's followers
      this.userService.getFollowers(this.userId).subscribe(user => {
        this.followerList$ = user.followers;
      });

      //Retrieve list of people that user is following
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

}