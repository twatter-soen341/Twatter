import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar, MatTabChangeEvent} from '@angular/material';
import {AuthService} from '../services/auth.service';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../services/user.service';

const baseURL = `${environment.baseUrl}/user`;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent implements OnInit {
  private headerTitle = 'Change your Settings';
  private user;
  changeForm: FormGroup = new FormGroup({
    firstNameController: new FormControl('', [Validators.required]),
    lastNameController: new FormControl('', [Validators.required]),
    usernameController: new FormControl('', [Validators.required]),
    emailController: new FormControl('', [Validators.required, Validators.email]),
    currentPasswordController: new FormControl('', [Validators.required]),
    passwordController: new FormControl('', [Validators.required]),
    passwordConfirmController: new FormControl('', [Validators.required])
  });

  hide_Password = true;
  hide_Confirmation = true;

  constructor(private authService: AuthService, private userService: UserService, private http: HttpClient) {
  }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {
      this.user = user;
    });
  }

  changeHeaderTitle(title: string) {
    this.headerTitle = title;
  }

  // Function which will change the title of the menu depending on the tabs the user will choose
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

  // ICI
  changeUserName() {
    this.user.firstName = this.changeForm.get('firstNameController').value;
    this.user.lastName = this.changeForm.get('lastNameController').value;
    console.log(this.user);
    this.userService.updateUserNames(this.user.firstName, this.user.lastName);
    }
  // }

  changeUserEmail() {

  }

  changeUserPassword() {

  }
}
