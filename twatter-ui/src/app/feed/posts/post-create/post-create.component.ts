import {
  Component,
  OnInit,
  Inject
} from '@angular/core';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { Post } from '../../../models/post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../../../services/post.service';
import { UserService } from 'src/app/services/user.service';

let submitted = false;

// The Component decorator
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  userId: string;
  firstName: string;
  lastName: string;
  userName: string;

  constructor(public dialog: MatDialog, private userService: UserService) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {
      this.userId = user._id;
      this.firstName = user.firstName;
      this.lastName = user.lastName;
      this.userName = user.userName;
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(PostCreateDialogComponent, {
      width: '80%',
      position: {top: '5rem'},
      data: {
        userId: this.userId,
        userName: this.userName,
        firstName: this.firstName,
        lastName: this.lastName,
        content: 'x'
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
  userId: string;
  firstName: string;

  constructor(
    public dialogRef: MatDialogRef<PostCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Post,
    public postsService: PostsService,
    private userService: UserService) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {
      this.userId = user.id;
      this.firstName = user.firstName;
    });
  }

  onCreatePost(form: NgForm) {
      const post = {
        id: this.data.id,
        userId: this.data.userId,
        firstName: this.data.firstName,
        lastName: this.data.lastName,
        timeStamp: Date.now(),
        content: form.value.content.replace(/\n/g, '<br>'),
    };

    this.postsService.addPost(post);
    submitted = true;
    this.dialogRef.close();
  }

}
