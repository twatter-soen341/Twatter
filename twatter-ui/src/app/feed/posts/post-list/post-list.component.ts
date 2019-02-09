import {
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../../../models/post.model';
import { PostsService } from '../../../services/post.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
  // @Input() posts: Post[] = [];
  posts: Post[] = [];
  private postsSub: Subscription;

  constructor(public aPostsService: PostsService, private authService: AuthService) {}

  ngOnInit() {
    // temporary until post services is done
    this.posts = this.aPostsService.getPosts();
    this.postsSub = this.aPostsService.getPostUpdateListener().subscribe(
      (posts: Post[]) => {
        this.posts = posts;
      }
    );
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

}
