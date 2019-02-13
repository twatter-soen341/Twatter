import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';

@Component({
  selector: 'app-twat-icon-btn',
  templateUrl: './twat-icon-btn.component.html',
  styleUrls: ['./twat-icon-btn.component.scss']
})
export class TwatIconBtnComponent implements OnInit {
  private clicked = false;
  public icon = 'flame';

  @Output
  public clickEvent = new EventEmitter<boolean>();

  @Input
  public liked = false;

  constructor(public iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
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

    if (this.liked) {
      this.clicked = true;
      this.icon = 'red-flame';
    }
  }

  ngOnInit() {
  }

  onClick() {
    if (this.clicked) {
      this.icon = 'flame';
      this.clicked = false;
      this.clickEvent.emit(false);
    } else {
      this.clicked = true;
      this.icon = 'red-flame';
      this.clickEvent.emit(true);
    }
  }
}
