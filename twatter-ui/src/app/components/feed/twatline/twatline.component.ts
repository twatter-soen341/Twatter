import {
  Component,
  OnInit
} from '@angular/core';
import {Subscription} from 'rxjs';

import {Twat} from '../../../models/twat.model';
import {TwatsService} from '../../../services/twat.service';
import {UserService} from 'src/app/services/user.service';

@Component({
  selector: 'app-twatline',
  templateUrl: './twatline.component.html',
  styleUrls: ['./twatline.component.scss']
})
export class TwatlineComponent implements OnInit {

  twats: Twat[] = [];
  private followingUsers: string[];
  private userId;
  private twatsSub: Subscription;

  constructor(public aTwatsService: TwatsService, public userService: UserService) {
  }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {

      this.userId = user._id;
      this.followingUsers = user.following;

      this.twatsSub = this.aTwatsService.getTwatUpdateListener().subscribe(
        (twats: Twat[]) => {
          this.twats = [];
          for (const i in twats) {
            if (this.followingUsers && twats[i] && (twats[i].userId === this.userId || this.followingUsers.includes(twats[i].userId))) {
              this.twats.push(twats[i]);
            }
          }
        }
      );

      this.aTwatsService.getTwats();
    });
  }
}
