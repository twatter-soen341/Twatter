import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

@Component({
  selector: 'app-twat-icon-btn',
  templateUrl: './twat-icon-btn.component.html',
  styleUrls: ['./twat-icon-btn.component.scss']
})
export class TwatIconBtnComponent implements OnInit {
  private clicked = false;
  public icon = 'flame';

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
  }

  onClick() {
    if (this.clicked) {
      this.icon = 'flame';
      this.clicked = false;
    } else {
      this.clicked = true;
      this.icon = 'red-flame';
    }
  }
}
