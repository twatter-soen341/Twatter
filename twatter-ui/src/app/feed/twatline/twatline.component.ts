import {
  Component,
  OnInit
} from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../../models/post.model';
import { PostsService } from '../../services/post.service';

@Component({
  selector: 'app-twatline',
  templateUrl: './twatline.component.html',
  styleUrls: ['./twatline.component.scss']
})
export class TwatlineComponent implements OnInit {

  posts: Post[] = [];
  private postsSub: Subscription;
  constructor(public aPostsService: PostsService) {}

  ngOnInit() {
    this.aPostsService.getPosts();
      this.postsSub = this.aPostsService.getPostUpdateListener().subscribe(
        (posts: Post[]) => {
          this.posts = posts;
        }
      );
  }
}
