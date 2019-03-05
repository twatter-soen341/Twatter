import { Component, OnInit, Input} from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-follow-button',
  templateUrl: './follow-button.component.html',
  styleUrls: ['./follow-button.component.scss']
})
export class FollowButtonComponent implements OnInit {

  @Input()
  private otherUser;
  private currentUser;
  followTxt : string;

  constructor(private userService:UserService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if(params['id'])
        this.otherUser = params['id'];
    });

    this.userService.getCurrentUser().subscribe(user => {
      this.currentUser = user._id;
      this.followTxt = user.following.includes(this.otherUser)? 'Unfollow': 'Follow';
    });
  }

  isFollowing(array){
    if(array){
      return array.includes(this.otherUser);
    }else{
      return false;
    }
  }

  toggleFollow() {
    if(this.followTxt == 'Unfollow'){
      this.userService.unfollowUser(this.otherUser);
      this.followTxt =  'Follow';
    }else{
      this.userService.followUser(this.otherUser);
      this.followTxt = 'Unfollow';
    }
  }

}
