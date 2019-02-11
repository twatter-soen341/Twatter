import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  Input
} from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../../../models/post.model';
import { PostsService } from '../../../services/post.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
  @Input() posts: Post[] = [];
  private postsSub: Subscription;

  constructor(public aPostsService: PostsService, private authService: AuthService, public dialog: MatDialog) {}

  ngOnInit() {}

  onEdit(id: string) {
    const post = this.aPostsService.getPost(id).subscribe((postData) => {
      const dialogRef = this.dialog.open(PostEditDialogComponent, {
        width: '80%',
        position: {top: '5rem'},
        data: {
          id: postData._id,
          userId: postData.userId,
          firstName: postData.firstName,
          lastName: postData.lastName,
          timeStamp: postData.timeStamp,
          content: postData.content
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
    this.postsSub.unsubscribe();
  }

}

@Component({
  selector: 'app-post-edit-dialog',
  templateUrl: './post-edit-dialog.component.html',
  styleUrls: ['../post-create/post-create.component.scss']
})
export class PostEditDialogComponent implements OnInit {
  content = '';

  constructor(
    public dialogRef: MatDialogRef<PostEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Post,
    public postsService: PostsService) {}

    ngOnInit() {
      console.log('inside dialog');
    this.content = this.data.content;
  }

  onSave(form: NgForm) {
    this.postsService.updatePost(
      this.data.id,
      this.data.firstName,
      this.data.lastName,
      new Date().getTime(),
      form.value.content.replace(/\n/g, '<br>')
    );

    this.dialogRef.close();
  }

}
