import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/auth.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

userId: string;
loggedUser: string;
user = {
  firstName: '',
  lastName: '',
  following: [],
  followers: []
};
nbFollowing: number;
nbFollowers: number;

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = params['id'];

      this.userService.getUserWithId(this.userId).subscribe(user => {
        this.user = user;
        console.log(user);

        this.nbFollowing = user.following.length;
        this.nbFollowers = user.followers.length;

        this.userService.getCurrentUser().subscribe(cUser => {
          this.loggedUser = cUser._id;
        });
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
