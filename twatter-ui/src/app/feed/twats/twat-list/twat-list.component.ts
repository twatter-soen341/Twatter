import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  Input,
  Output
} from '@angular/core';
import {Subscription} from 'rxjs';

import {Twat} from '../../../models/twat.model';
import {TwatsService} from '../../../services/twat.service';
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
  @Input() twats: Twat[] = [];
  @Input() simplified = false;
  @Input() limit = 1000;
  @Output() liked;
  private twatsSub: Subscription;
  userId: string;
  userTwatId: string;

  constructor(
    public aTwatsService: TwatsService,
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

  goToProfile(userTwatId: string) {
    this.router.navigate(['/profile', userTwatId]);
  }

  onEdit(id: string) {
    const twat = this.aTwatsService.getTwat(id).subscribe((twatData) => {
      const dialogRef = this.dialog.open(TwatEditDialogComponent, {
        width: '80%',
        position: {top: '5rem'},
        data: {
          id: twatData.twat._id,
          userID: twatData.twat.user._id,
          firstName: twatData.twat.user.firstName,
          lastName: twatData.twat.user.lastName,
          timeStamp: twatData.twat.timeStamp,
          content: twatData.twat.content,
          likedBy: twatData.twat.likedBy,
          comments: twatData.twat.comments
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    });
  }

  commentTwat(twat: Twat, comment: Comment) {

    if (!twat.comments) {
      twat.comments = [comment];
    } else {
      twat.comments.push(comment);
    }
    this.aTwatsService.updateTwat(twat);
  }

  deleteComment(twat: Twat, comment: Comment) {
    const index = twat.comments.indexOf(comment);
    twat.comments.splice(index, 1);

    this.aTwatsService.updateTwat(twat);
  }

  editComment(twat: Twat, comments: any) {
    const index = twat.comments.indexOf(comments.oldComment);
    twat.comments[index] = comments.newComment;

    this.aTwatsService.updateTwat(twat);
  }


  onDelete(twatID: string) {
    this.aTwatsService.deleteTwat(twatID);
  }

  ngOnDestroy() {
    if (this.twatsSub) {
      this.twatsSub.unsubscribe();
    }
  }

  isUser(currentUserId) {
    if (currentUserId === this.userId) {
      return true;
    } else {
      return false;
    }
  }

  likeTwat(twat: Twat, event) {
    if (event === true) {
      twat.likedBy.push(this.authService.getUserId());
    } else {
      const index = twat.likedBy.indexOf(this.authService.getUserId());
      twat.likedBy.splice(index, 1);
    }
    this.aTwatsService.updateTwat(twat);
  }

  isLikedByUser(twat) {
    return twat.likedBy.includes(this.authService.getUserId());
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
    @Inject(MAT_DIALOG_DATA) public data: Twat,
    public twatsService: TwatsService,
    private userService: UserService) {}

  ngOnInit() {
    console.log('inside dialog');
    this.content = this.data.content.replace(/<br>/g, '\n');
    this.userService.getCurrentUser().subscribe(user => {
      this.userId = user._id;
    });
  }

  onSave(form: NgForm) {
    const twat = {
      id: this.data.id,
      userId: this.userId,
      firstName: this.data.firstName,
      lastName: this.data.lastName,
      timeStamp: Date.now(),
      content: form.value.content.replace(/\n/g, '<br>'),
      likedBy: this.data.likedBy,
      comments: this.data.comments
  };

    this.twatsService.updateTwat(twat);
    this.dialogRef.close();
  }

}
