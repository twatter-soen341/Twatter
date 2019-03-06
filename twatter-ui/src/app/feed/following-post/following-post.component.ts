import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/auth.model';
import { Post } from 'src/app/models/post.model';
import { PostsService } from 'src/app/services/post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-following-post',
  templateUrl: './following-post.component.html',
  styleUrls: ['./following-post.component.scss']
})
export class FollowingPostComponent implements OnInit {
  private followingUsers: string[];
  private isFollowingSomeone: boolean;
  protected posts: Post[] = [];
  private postsSub: Subscription;

  constructor (private userService: UserService, private postsService: PostsService) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {
        this.followingUsers = user.following;

        if (this.followingUsers.length>0) {
          this.isFollowingSomeone = true;
          // tslint:disable-next-line:forin
          for (let i in this.followingUsers) {
            this.postsService.getUserPosts(this.followingUsers[i]);
            this.postsSub = this.postsService.getPostUpdateListener().subscribe(
              (posts: Post[]) => {
                // if statement is a temporary fix
                // TODO: Find what causes 2x request
                  if (!this.posts.includes(posts[i])) {
                    this.posts.push(posts[i]);
                  }
              }
              );
          }
        }else{
          this.isFollowingSomeone = false;
        }
    });
  }

  isFollowingSomeoneFunction(){
    return this.isFollowingSomeone;
  }
}