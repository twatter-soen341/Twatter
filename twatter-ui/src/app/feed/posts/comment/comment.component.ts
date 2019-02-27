import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Comment} from '../../../models/comment.model';
import {AuthService} from '../../../services/auth.service';
import {User} from "../../../models/auth.model";
import {UserService} from "../../../services/user.service";
import {Post} from "../../../models/post.model";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  commentControl = new FormControl('');

  @Input()
  post: Post;

  @Output('commented')
  commentEmitter = new EventEmitter<Comment>();
  @Output('deleted')
  deleteEmitter = new EventEmitter<Comment>();

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

  canDelete(comment: Comment){
    if(comment.userId == this.authService.getUserId() || this.post.userId == this.authService.getUserId()){
      return true;
    }else{
      return false;
    }
  }

  deleteComment(comment: Comment){
    this.deleteEmitter.emit(comment);
  }

  postComment() {
    const comment: Comment = {
      userId: this.authService.getUserId(),
      postId: this.post.id,
      text: this.commentControl.value
    };

    this.commentEmitter.emit(comment);
    this.commentControl.reset();
  }
}
