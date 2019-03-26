import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/auth.model';
import { Twat } from 'src/app/models/twat.model';
import { UserService } from 'src/app/services/user.service';
import { TwatsService } from 'src/app/services/twat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
  private searchValue: string[];
  users: User[];
  userError = false;
  twatError = false;
  twats: Twat[] = []; // TODO: refactor variables

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private twatsService: TwatsService, // TODO: refactor variables
    private router: Router
    ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      console.log(params.search);
      this.searchValue = params.search.split(' ');

      /* Users */
      this.userService.searchUser(this.searchValue[0]).subscribe(
        users => {
          console.log(users);
          this.users = users;
          this.userError = false;
        },
        error => {
          this.users = null;
          this.userError = true;
        }
      );
      /* TODO Twats */
      this.twatsService.searchTwat(this.searchValue[0]).subscribe(
        twats => {
          this.twats = twats;
          this.twatError = false;
        },
        error => {
          this.twats = null;
          this.twatError = true;
        }
      );
    });
  }

  goToProfile(userId: string) {
    this.router.navigate(['/profile', userId]);
  }
}
