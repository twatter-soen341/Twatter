import {
  Component,
  OnInit,
  Inject
} from '@angular/core';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { Post } from '../../../models/post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../post.service';

let post: Post = {
  user: 'USER\'S NAME',
  timeStamp: new Date,
  content: '',
};

let submitted = false;

// The Component decorator
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  user = post.user;
  // title: "title";
  // content: string;

  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  openDialog() {
    const dialogRef = this.dialog.open(PostCreateDialogComponent, {
      width: '80%',
      position: {top: '5rem'},
      data: {user: post.user, title: post.timeStamp, content: post.content}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      submitted = false;
    });
  }
}

@Component({
  selector: 'app-post-create-dialog',
  templateUrl: './post-create-dialog.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateDialogComponent implements OnInit {
  user = post.user;

  constructor(
    public dialogRef: MatDialogRef<PostCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Post,
    public postsService: PostsService) {}

  ngOnInit() {}

  onCreatePost(form: NgForm) {
      post = {
      user: 'USER\'S NAME',
      timeStamp: new Date(),
      content: form.value.content.replace(/\n/g, '<br>'),
    };

    this.postsService.addPost(post);
    submitted = true;
    this.dialogRef.close();
  }

}
