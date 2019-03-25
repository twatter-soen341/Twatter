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
import {Router} from "@angular/router";

@Component({
  selector: 'app-twat-list',
  templateUrl: './twat-list.component.html',
  styleUrls: ['./twat-list.component.scss']
})
export class TwatListComponent implements OnInit, OnDestroy {
  @Input() posts: Post[] = [];
  @Input() simplified = false;
  @Input() limit = 1000;
  @Output() liked;
  private postsSub: Subscription;
  userId: string;
  posterId: string;

  constructor(
    public aPostsService: PostsService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {
      this.userId = user._id;
    });

  }

  goToProfile(posterId: string) {
    this.router.navigate(['/profile', posterId]);
  }

  onEdit(id: string) {
    const post = this.aPostsService.getPost(id).subscribe((twatData) => {
      const dialogRef = this.dialog.open(TwatEditDialogComponent, {
        width: '80%',
        position: {top: '5rem'},
        data: {
          id: twatData.post._id,
          userID: twatData.post.user._id,
          firstName: twatData.post.user.firstName,
          lastName: twatData.post.user.lastName,
          timeStamp: twatData.post.timeStamp,
          content: twatData.post.content,
          likedBy: twatData.post.likedBy,
          comments: twatData.post.comments
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

  deleteComment(post: Post, comment: Comment) {
    const index = post.comments.indexOf(comment);
    post.comments.splice(index, 1);

    this.aPostsService.updatePost(post);
  }

  editComment(post: Post, comments: any) {
    const index = post.comments.indexOf(comments.oldComment);
    post.comments[index] = comments.newComment;

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
  selector: 'app-twat-edit-dialog',
  templateUrl: './twat-edit-dialog.component.html',
  styleUrls: ['../twat-create/twat-create.component.scss']
})
export class TwatEditDialogComponent implements OnInit {
  content = '';
  private userId;

  constructor(
    public dialogRef: MatDialogRef<TwatEditDialogComponent>,
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
      likedBy: this.data.likedBy,
      comments: this.data.comments
  };

    this.postsService.updatePost(post);
    this.dialogRef.close();
  }

}
