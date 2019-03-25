import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import {MatIconRegistry} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'twatter-ui';

  constructor(public router: Router, private authService: AuthService, public iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'flame',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/flame-2.svg'));

    iconRegistry.addSvgIcon(
      'red-flame',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/flame-2-red.svg'));

  }

  ngOnInit() {
    this.authService.resumeSession();
    window.scroll(0,0);
  }

  onActivate() {
    window.scroll(0,0);
  }

}
