import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  Input,
  Output
} from '@angular/core';
import {Subscription} from 'rxjs';

import {Post} from '../../../models/post.model';
import {PostsService} from '../../../services/post.service';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar} from '@angular/material';
import {NgForm} from '@angular/forms';
import {UserService} from 'src/app/services/user.service';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
  @Input() posts: Post[] = [];
  @Output() liked;
  private postsSub: Subscription;
  userId: string;

  constructor(public aPostsService: PostsService, private userService: UserService,
              private authService: AuthService, public dialog: MatDialog, private snack: MatSnackBar) {
  }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {
      this.userId = user._id;
    });
  }

  onEdit(id: string) {
    const post = this.aPostsService.getPost(id).subscribe((postData) => {
      const dialogRef = this.dialog.open(PostEditDialogComponent, {
        width: '80%',
        position: {top: '5rem'},
        data: {
          id: postData.post._id,
          userID: postData.post.user._id,
          firstName: postData.post.user.firstName,
          lastName: postData.post.user.lastName,
          timeStamp: postData.post.timeStamp,
          content: postData.post.content,
          likedBy: postData.post.likedBy,
          comments: postData.post.comments
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    });
  }

  commentPost(post: Post, comment: Comment){

    if(!post.comments) {
      post.comments = [comment];
    }else {
      post.comments.push(comment);
    }
    this.aPostsService.updatePost(post);
  }

  deleteComment(post: Post, comment: Comment){
    const index = post.comments.indexOf(comment);
    post.comments.splice(index,1);

    this.aPostsService.updatePost(post);
  }

  onDelete(postID: string) {
    this.aPostsService.deletePost(postID);
  }

  ngOnDestroy() {
    if (this.postsSub) {
      this.postsSub.unsubscribe();
    }
  }

  isUser(currentUserId) {
    if (currentUserId === this.userId) {
      return true;
    } else {
      return false;
    }
  }

  likePost(post: Post, event) {
    if (event === true) {
      post.likedBy.push(this.authService.getUserId());
    } else {
      const index = post.likedBy.indexOf(this.authService.getUserId());
      post.likedBy.splice(index, 1);
    }
    this.aPostsService.updatePost(post);
  }

  isLikedByUser(post) {
    return post.likedBy.includes(this.authService.getUserId());
  }

}

@Component({
  selector: 'app-post-edit-dialog',
  templateUrl: './post-edit-dialog.component.html',
  styleUrls: ['../post-create/post-create.component.scss']
})
export class PostEditDialogComponent implements OnInit {
  content = '';
  private userId;

  constructor(
    public dialogRef: MatDialogRef<PostEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Post,
    public postsService: PostsService,
    private userService: UserService) {}

  ngOnInit() {
    console.log('inside dialog');
    this.content = this.data.content.replace(/<br>/g, '\n');
    this.userService.getCurrentUser().subscribe(user => {
      this.userId = user._id;
    });
  }

  onSave(form: NgForm) {
    const post = {
      id: this.data.id,
      userId: this.userId,
      firstName: this.data.firstName,
      lastName: this.data.lastName,
      timeStamp: Date.now(),
      content: form.value.content.replace(/\n/g, '<br>'),
      likedBy: this.data.likedBy
  };

    this.postsService.updatePost(post);
    this.dialogRef.close();
  }

}
