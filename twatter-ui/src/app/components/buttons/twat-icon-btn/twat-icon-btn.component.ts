import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-twat-icon-btn',
  templateUrl: './twat-icon-btn.component.html',
  styleUrls: ['./twat-icon-btn.component.scss']
})
export class TwatIconBtnComponent implements OnInit {
  public icon = 'flame';
 likesStyle = 'defaultLikes';

  @Output() public clickEvent = new EventEmitter<boolean>();

  @Input() public liked;

  @Input() public likes: string[];

  likesNames = [];

  constructor(public iconRegistry: MatIconRegistry, private userService: UserService, sanitizer: DomSanitizer) {}

  ngOnInit() {
    if (this.liked) {
      this.icon = 'red-flame';
      this.likesStyle = 'coloredLikes';
    }

    for (let id in this.likes) {
      if (this.likes) {
        this.userService.getUserWithId(this.likes[id]).subscribe(
          user => {},
          err => {
          const index = this.likes.indexOf(this.likes[id]);
          this.likes.splice(index, 1);
          console.log(index);
        });
      }
    }
    if (this.likes) {
      this.userService.getUsersNames(this.likes).subscribe((response) => {
        for (const user of response) {
          this.likesNames.push(user.firstName + ' ' + user.lastName);
        }
      });
    }
  }

  onClick() {
    if (this.liked) {
      this.icon = 'flame';
      this.likesStyle = 'defaultLikes';
      this.clickEvent.emit(false);
    } else {
      this.icon = 'red-flame';
      this.likesStyle = 'coloredLikes';
      this.clickEvent.emit(true);
    }
  }

  getNamesLikes(): string {
    if (this.likes.length > 0) {
      let toReturn = 'Liked by:';
      this.likesNames.forEach((name) => toReturn += '\n' + name);
      return toReturn;
    } else {
      return 'No one loves you';
    }
  }
}
