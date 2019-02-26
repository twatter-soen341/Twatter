import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Comment} from '../../../models/comment.model';
import {AuthService} from '../../../services/auth.service';
import {User} from "../../../models/auth.model";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  commentControl = new FormControl('');

  @Input()
  postId: string;

  @Output('commented')
  commentEmitter = new EventEmitter<null>();

  @Input()
  comments: Comment[] = [];

  commentNameMap = new Map<User, Comment>();

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    //TODO Get comment user and map them
  }

  postComment() {

    const comment: Comment = {
      userId: this.authService.getUserId(),
      postId: this.postId,
      text: this.commentControl.value
    };

    this.commentEmitter.emit(null);
    this.comments.push(comment);
    this.commentControl.reset();
  }
}
