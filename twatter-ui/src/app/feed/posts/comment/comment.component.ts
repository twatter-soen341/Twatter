import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Comment} from '../../../models/comment.model';
import {AuthService} from '../../../services/auth.service';
import {User} from "../../../models/auth.model";
import {UserService} from "../../../services/user.service";

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
  commentEmitter = new EventEmitter<Comment>();

  @Input()
  comments: Comment[] = [];

  commentNameMap = new Map<string, string>();

  constructor(private authService: AuthService, private userService: UserService) {

  }

  ngOnInit() {
    if(!this.comments){
      this.comments = [];
    }else{
      const ids = this.comments.map((comment) => comment.userId);

      this.userService.getUsersNames(ids).subscribe((response) => {
        for(let user of response){
          this.commentNameMap.set(user._id, user.firstName + ' ' + user.lastName);
        }
        });
    }
  }

  postComment() {
    const comment: Comment = {
      userId: this.authService.getUserId(),
      postId: this.postId,
      text: this.commentControl.value
    };

    this.commentEmitter.emit(comment);
    this.commentControl.reset();
  }
}
