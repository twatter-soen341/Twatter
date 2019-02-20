import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar, MatTabChangeEvent} from '@angular/material';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  private headerTitle = 'Change your Settings';
  changeForm: FormGroup = new FormGroup({
    firstNameController: new FormControl('', [Validators.required]),
    lastNameController: new FormControl('', [Validators.required]),
    usernameController: new FormControl('', [Validators.required]),
    emailController: new FormControl('', [Validators.required, Validators.email]),
    passwordController: new FormControl('', [Validators.required]),
    passwordConfirmController: new FormControl('', [Validators.required])
  });

  hide_Password = true;
  hide_Confirmation = true;

  constructor() {
  }

  ngOnInit() {
  }

  changeHeaderTitle(title: string) {
    this.headerTitle = title;
  }

  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    console.log('tabChangeEvent => ', tabChangeEvent);
    console.log('index => ', tabChangeEvent.index);
    if (tabChangeEvent.index < 4) {
      this.headerTitle = 'Change your Info';
    } else {
      this.headerTitle = 'Change your Preferences';
    }

  }

  showPassword() {
    this.hide_Password = false;
  }

  hidePassword() {
    this.hide_Password = true;
  }

  showConfirmation() {
    this.hide_Confirmation = false;
  }

  hideConfirmation() {
    this.hide_Confirmation = true;
  }
}
