import {
  Component,
  OnInit
} from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../../models/post.model';
import { PostsService } from '../../services/post.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-twatline',
  templateUrl: './twatline.component.html',
  styleUrls: ['./twatline.component.scss']
})
export class TwatlineComponent implements OnInit {

  posts: Post[]=[];
  followingUsers: string[];
  isFollowingSomeone: boolean;
  private postsSub: Subscription;
  constructor(private aPostsService: PostsService, private userService: UserService) {}

  ngOnInit() {
    // // get current user's following
    // this.userService.getCurrentUser().subscribe(user =>{
    //   this.followingUsers = user.following;
    //   if(this.followingUsers){
    //     this.isFollowingSomeone = true;
    //   }else{
    //     this.isFollowingSomeone = false;
    //   }
    // });
    
    // // get all posts on database
    // this.aPostsService.getPosts();

    // // get latest updates on posts
    // this.postsSub = this.aPostsService.getPostUpdateListener().subscribe(
    //   (posts: Post[]) => {
    //     for(let post in posts){
    //       if(this.followingUsers && this.followingUsers.includes(posts[post].userId)){
    //         this.posts.push(posts[post]);
    //       }
    //     }
    //   }
    // );
  }

  isFollowingSomeoneFunction(){
    return this.isFollowingSomeone;
  }
}
