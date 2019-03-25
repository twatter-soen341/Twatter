import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Comment} from '../../../models/comment.model';
import {AuthService} from '../../../services/auth.service';
import {User} from '../../../models/auth.model';
import {UserService} from '../../../services/user.service';
import {Twat} from '../../../models/twat.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {



  @Input()
  twat: Twat;
  @Input()
  comments: Comment[] = [];

  @Output('commented')
  commentEmitter = new EventEmitter<Comment>();
  @Output('deleted')
  deleteEmitter = new EventEmitter<Comment>();
  @Output('edited')
  editEmitter = new EventEmitter<any>();

  commentControl = new FormControl('');

  editControl = new FormControl('');
  currentlyEditing: Comment;

  commentNameMap = new Map<string, string>();

  constructor(private authService: AuthService, private userService: UserService, private router: Router) {

  }

  ngOnInit() {
    if (!this.comments) {
      this.comments = [];
    } else {
      const ids = this.comments.map((comment) => comment.userId);

      this.userService.getUsersNames(ids).subscribe((response) => {
        for (const user of response) {
          this.commentNameMap.set(user._id, user.firstName + ' ' + user.lastName);
        }
        });
    }
  }

  canDelete(comment: Comment) {
    if (comment.userId === this.authService.getUserId() || this.twat.userId === this.authService.getUserId()) {
      return true;
    } else {
      return false;
    }
  }

  canEdit(comment: Comment) {
    if (comment.userId === this.authService.getUserId()) {
      return true;
    } else {
      return false;
    }
  }

  deleteComment(comment: Comment) {
    this.deleteEmitter.emit(comment);
  }

  editComment(comment: Comment) {
    this.editControl.setValue(comment.text);
    this.currentlyEditing = comment;
  }

  finishEditComment(comment: Comment) {
    const newComment: Comment = {
      userId: comment.userId,
      text: this.editControl.value,
      postId: comment.postId // TODO change postId to twat id in comment model
    };

    this.editEmitter.emit({oldComment: comment, newComment: newComment});
    this.editControl.reset();
    this.currentlyEditing = null;
  }


  postComment() {
    const comment: Comment = {
      userId: this.authService.getUserId(),
      postId: this.twat.id,
      text: this.commentControl.value
    };

    this.commentEmitter.emit(comment);
    this.commentControl.reset();
  }

  goToProfile(userTwatId: string) {
    this.router.navigate(['/profile', userTwatId]);
  }

}
