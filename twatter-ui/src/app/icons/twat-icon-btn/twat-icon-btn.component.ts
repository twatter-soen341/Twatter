import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import {UserService} from "../../services/user.service";

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

  constructor(public iconRegistry: MatIconRegistry, private userService: UserService, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'flame',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/flame-2.svg'));

    iconRegistry.addSvgIcon(
      'red-flame',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/flame-2-red.svg'));

    iconRegistry.addSvgIcon(
      'flame-flipped',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/flame-2-flipped.svg'));

    iconRegistry.addSvgIcon(
      'red-flame-flipped',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/flame-2-red-flipped.svg'));
  }

  ngOnInit() {
    if (this.liked) {
      this.icon = 'red-flame';
      this.likesStyle = 'coloredLikes';
    }

    if (this.likes) {
      this.userService.getUsersNames(this.likes).subscribe((response) => {
        for (let user of response) {
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
      return "No one loves you";
    }
  }
}
