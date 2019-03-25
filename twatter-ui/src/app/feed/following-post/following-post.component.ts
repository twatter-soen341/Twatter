import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/auth.model';
import { Twat } from 'src/app/models/twat.model';
import { TwatsService } from 'src/app/services/twat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-following-post',
  templateUrl: './following-post.component.html',
  styleUrls: ['./following-post.component.scss']
})
export class FollowingPostComponent implements OnInit {
  private followingUsers: string[];
  private isFollowingSomeone: boolean;
  protected twats: Twat[] = []; // TODO rename variables related to post -> twat
  private twatsSub: Subscription;

  constructor (private userService: UserService, private twatsService: TwatsService) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {
        this.followingUsers = user.following;

        if (this.followingUsers.length > 0) {
          this.isFollowingSomeone = true;
          // tslint:disable-next-line:forin
          for (let i in this.followingUsers) {
            this.twatsService.getUserTwats(this.followingUsers[i]);
            this.twatsSub = this.twatsService.getTwatUpdateListener().subscribe(
              (twats: Twat[]) => {
                // if statement is a temporary fix
                // TODO: Find what causes 2x request
                   if(twats[0] && (this.twats.findIndex(p => p.id === twats[0].id) < 0)) {
                    this.twats.push(twats[0]);
                  }
              }
              );
          }
        } else {
          this.isFollowingSomeone = false;
        }
    });
  }

  isFollowingSomeoneFunction(){
    return this.isFollowingSomeone;
  }
}
