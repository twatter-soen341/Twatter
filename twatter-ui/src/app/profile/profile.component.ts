import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { Twat } from '../models/twat.model';
import { TwatsService } from '../services/twat.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userId: string;
  posts: Twat[] = []; // TODO rename posts to twats
  private postsSub: Subscription;

  constructor(
    public aPostsService: TwatsService, // TODO rename aPostsService to aTwatsService
    private authService: AuthService,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = params['id'];

      this.aPostsService.getUserTwats(this.userId);
      this.postsSub = this.aPostsService.getTwatUpdateListener().subscribe(
        (posts: Twat[]) => { // TODO Rename posts to twats
          this.posts = posts;
        }
      );
    });
  }
}

