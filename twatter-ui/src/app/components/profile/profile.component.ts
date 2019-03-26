import {Component, OnInit, Output,} from '@angular/core';
import {Subscription} from 'rxjs';

import {Twat} from '../../models/twat.model';
import {TwatsService} from '../../services/twat.service';
import {AuthService} from 'src/app/services/auth.service';
import {MatDialog} from '@angular/material';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userId: string;
  twats: Twat[] = [];
  private postsSub: Subscription;
  @Output () totalLikes = 0;

  constructor(
    public twatsService: TwatsService,
    private authService: AuthService,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = params['id'];

      this.twatsService.getUserTwats(this.userId);
      this.postsSub = this.twatsService.getTwatUpdateListener().subscribe(
        (twats: Twat[]) => {
          this.twats = twats;
          // reset likes to properly count total likes
          this.totalLikes = 0;
          for (let twat in twats) {
            if (twats[twat]) {
              this.totalLikes += twats[twat].likedBy.length;
            }
          }
        }
      );
    });
  }
}

