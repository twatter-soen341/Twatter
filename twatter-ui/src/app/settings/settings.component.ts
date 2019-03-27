import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar, MatTabChangeEvent} from '@angular/material';
import {AuthService} from '../services/auth.service';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../services/user.service';
import {User} from '../models/auth.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent implements OnInit {
  @Output() test = new EventEmitter();
  private headerTitle = 'Change your Settings';
  private user: User;
  private router: Router;
  consent = false;
  changeForm: FormGroup = new FormGroup({
    firstNameController: new FormControl('', [Validators.required]),
    lastNameController: new FormControl('', [Validators.required]),
    usernameController: new FormControl('', [Validators.required]),
    emailController: new FormControl('', [Validators.required, Validators.email]),
    emailForPassword: new FormControl('', [Validators.required]),
    currentPasswordForEmail: new FormControl('', [Validators.required]),
    currentPasswordController: new FormControl('', [Validators.required]),
    passwordController: new FormControl('', [Validators.required]),
    passwordConfirmController: new FormControl('', [Validators.required]),
    passwordToDelete: new FormControl('', [Validators.required]),
    emailToDelete: new FormControl('', [Validators.required])
  });

  hide_Password = true;
  hide_Confirmation = true;


  constructor(private authService: AuthService, private userService: UserService, private snack: MatSnackBar, private http: HttpClient) {
  }

  ngOnInit() {
    // Gets an 'object' of the current user
    this.userService.getCurrentUser().subscribe(user => {
      this.user = user;
    });
  }

  // Function which will change the title of the menu depending on the tabs the user will choose
  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    if (tabChangeEvent.index <= 2) {
      this.headerTitle = 'Change your Info';
    } else {
      this.headerTitle = 'Delete your Account';
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

  // Function which changes the name of a user
  changeUserName() {
    if ((this.changeForm.get('firstNameController').value !== '') && (this.changeForm.get('lastNameController').value !== '')) {
      this.user.firstName = this.changeForm.get('firstNameController').value;
      this.user.lastName = this.changeForm.get('lastNameController').value;
      this.userService.updateUserNames(this.user)
        .subscribe(
          res => {
            this.changeForm.reset('');
            this.snack.open('Name changed!', 'Ok');
          },
          error => {
            this.changeForm.reset('');
            this.snack.open('Could not change name', 'Ok');
          });
      window.location.reload(); // To Update the name in Header
    }
  }

  changeUserEmail() {
    const email = this.changeForm.get('emailController').value;
    const password = this.changeForm.get('currentPasswordForEmail').value;
    const userID = this.authService.getUserId();
    if ((email !== '') && (password !== '')) {
      this.authService.updateUserEmail(email, password, userID)
        .subscribe(
          res => {
            this.changeForm.reset('');
            this.snack.open('Email changed!', 'Ok');
          },
          error => {
            this.changeForm.reset('');
            this.snack.open('Could not change email', 'Ok');
      });
    }
  }


  changeUserPassword() {
    const currentPassword = this.changeForm.get('currentPasswordController').value;
    const newPassword = this.changeForm.get('passwordController').value;
    const newPasswordConfirmation = this.changeForm.get('passwordConfirmController').value;
    const email = this.changeForm.get('emailForPassword').value;

    if ((currentPassword !== '') && (newPassword !== '') && (newPasswordConfirmation !== '') && (email !== '')) {
      if (newPassword === newPasswordConfirmation) {
        this.authService.updateUserPassword(email, currentPassword, newPassword)
          .subscribe(
            res => {
              this.changeForm.reset('');
              this.snack.open('Password changed!', 'Ok');
            },
            error => {
              this.changeForm.reset('');
              this.snack.open('Could not change password', 'Ok');
        });
        this.changeForm.get('currentPasswordController').reset(); // To make the field blank again
        this.changeForm.get('passwordController').reset(); // To make the field blank again
        this.changeForm.get('passwordConfirmController').reset(); // To make the field blank again
        this.changeForm.get('emailForPassword').reset(); // To make the field blank again
      }
    }
  }

  deleteUserAccount() {
    const password = this.changeForm.get('passwordToDelete').value;
    const email = this.changeForm.get('emailToDelete').value;

    if ((password !== '') && (email !== '')) {
      this.authService.deleteAccount(password, email)
      .subscribe(
        res => {
          this.authService.logout();
        }
      );
    }
  }
}
