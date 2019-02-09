import {
  Component,
  OnInit,
  Inject
} from '@angular/core';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { Post } from '../../../models/post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../../../services/post.service';
import { AuthData } from '../../../models/auth.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

let post: Post = {
  userID: 'ID',
  firstName: 'NAME',
  lastName: 'NAME',
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
  userID = post.userID;
  firstName = post.firstName;

  constructor(public dialog: MatDialog, private userService: UserService) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {
      this.userID = post.userID = user.id;
      this.firstName = post.firstName = user.firstName;
      post.lastName = user.lastName;

    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(PostCreateDialogComponent, {
      width: '80%',
      position: {top: '5rem'},
      data: {
        userID: post.userID,
        firstName: post.firstName,
        lastName: post.lastName,
        timeStamp: post.timeStamp,
        content: post.content
      }
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
  user = post.userID;
  firstName = post.firstName;

  constructor(
    public dialogRef: MatDialogRef<PostCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Post,
    public postsService: PostsService) {}

  ngOnInit() {}

  onCreatePost(form: NgForm) {
      post = {
      userID: post.userID,
      firstName: post.firstName,
      lastName: post.lastName,
      timeStamp: new Date(),
      content: form.value.content.replace(/\n/g, '<br>'),
    };

    this.postsService.addPost(post);
    submitted = true;
    this.dialogRef.close();
  }

}
