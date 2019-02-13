import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  Input
} from '@angular/core';
import {Subscription} from 'rxjs';

import {Post} from '../../../models/post.model';
import {PostsService} from '../../../services/post.service';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {NgForm} from '@angular/forms';
import {UserService} from 'src/app/services/user.service';
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
  @Input() posts: Post[] = [];
  private postsSub: Subscription;
  userId: any;

  constructor(public aPostsService: PostsService, private userService: UserService,
              private authService: AuthService, public dialog: MatDialog) {
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
          content: postData.post.content
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    });
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

  likePost(post, event) {
    if (event === true) {
      post.likes.push(this.authService.getUserId());
    } else {
      const index = post.likes.indexOf(this.authService.getUserId());
      post.likes.splice(index, 1);
    }
    this.aPostsService.updatePost(post);
  }

  isLikedByUser(post) {
    return post.likes.contains(this.authService.getUserId());
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
  };
    
    this.postsService.updatePost(post);
    this.dialogRef.close();
  }

}
