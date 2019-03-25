import {
  Component,
  OnInit,
  Inject
} from '@angular/core';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { Twat } from '../../../models/twat.model';
import { NgForm } from '@angular/forms';
import { TwatsService } from '../../../services/twat.service';
import { UserService } from 'src/app/services/user.service';

let submitted = false;

// The Component decorator
@Component({
  selector: 'app-twat-create',
  templateUrl: './twat-create.component.html',
  styleUrls: ['./twat-create.component.scss']
})
export class TwatCreateComponent implements OnInit {
  userId: string;
  firstName: string;
  lastName: string;
  userName: string;
  content: string;

  constructor(public dialog: MatDialog, private userService: UserService) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {
      this.userId = user._id;
      this.firstName = user.firstName;
      this.lastName = user.lastName;
      this.userName = user.userName;
      if (!this.content) {this.content = 'Hi ' + this.firstName + ', create a twat?'; }
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(TwatCreateDialogComponent, {
      width: '80%',
      position: {top: '5rem'},
      data: {
        userId: this.userId,
        userName: this.userName,
        firstName: this.firstName,
        lastName: this.lastName,
        content: this.content
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!dialogRef._containerInstance._config.data.content) {
        this.content = 'Hi ' + this.firstName + ', create a twat?';
      } else {
        this.content = dialogRef._containerInstance._config.data.content;
      }
      console.log('The dialog was closed');
      submitted = false;
    });
  }

  getContentTruncated() {
    if (this.content) {
      return this.content.length > 150 ? this.content.substring(0, 150) + '...' : this.content;
    } else {
      return this.content;
    }
  }
}

@Component({
  selector: 'app-twat-create-dialog',
  templateUrl: './twat-create-dialog.component.html',
  styleUrls: ['./twat-create.component.scss']
})
export class TwatCreateDialogComponent implements OnInit {
  userId: string;
  firstName: string;
  content: string;

  constructor(
    public dialogRef: MatDialogRef<TwatCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Twat,
    public twatsService: TwatsService,
    private userService: UserService) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {
      this.userId = user.id;
      this.firstName = user.firstName;
      if (this.data.content !== 'Hi ' + this.firstName + ', create a twat?') {
        this.content = this.data.content;
      }
      this.dialogRef._containerInstance._config.data.content = this.content;
    });
  }

  getContent(event) {
    // console.log(event);
    this.dialogRef._containerInstance._config.data.content = event;
  }

  onCreateTwat(form: NgForm) {
      const twat = {
        id: this.data.id,
        userId: this.data.userId,
        firstName: this.data.firstName,
        lastName: this.data.lastName,
        timeStamp: Date.now(),
        content: form.value.content.replace(/\n/g, '<br>'),
        likedBy: []
    };

    this.twatsService.addTwat(twat);
    submitted = true;
    this.data.content = '';
    this.dialogRef.close();
  }

}
