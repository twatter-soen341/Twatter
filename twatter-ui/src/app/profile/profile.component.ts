import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../models/post.model';
import { PostsService } from '../services/post.service';
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
  posts: Post[] = [];
  private postsSub: Subscription;

  constructor(
    public aPostsService: PostsService,
    private authService: AuthService,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = params['id'];

      this.aPostsService.getUserPosts(this.userId);
      this.postsSub = this.aPostsService.getPostUpdateListener().subscribe(
        (posts: Post[]) => {
          this.posts = posts;
        }
      );
    });
  }
}

