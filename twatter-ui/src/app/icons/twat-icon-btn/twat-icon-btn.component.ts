import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';

@Component({
  selector: 'app-twat-icon-btn',
  templateUrl: './twat-icon-btn.component.html',
  styleUrls: ['./twat-icon-btn.component.scss']
})
export class TwatIconBtnComponent implements OnInit {
  public icon = 'flame';

  @Output() public clickEvent = new EventEmitter<boolean>();

  @Input() public liked;

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
  }

  ngOnInit() {
    if (this.liked) {
      this.icon = 'red-flame';
    }
  }

  onClick() {
    if (this.liked) {
      this.icon = 'flame';
      this.clickEvent.emit(false);
    } else {
      this.icon = 'red-flame';
      this.clickEvent.emit(true);
    }
  }
}
