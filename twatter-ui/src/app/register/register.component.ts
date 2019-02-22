import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup = new FormGroup({
    firstNameController: new FormControl('', [Validators.required]),
    lastNameController: new FormControl('', [Validators.required]),
    emailController: new FormControl('', [Validators.required, Validators.email]),
    passwordController: new FormControl('', [Validators.required, this.notForbiddenPassword]),
    passwordConfirmController: new FormControl('', [Validators.required])
  }, this.passwordConfirmationMatchValidator);

  hide_Password = true;
  hide_Confirmation = true;

  constructor(private authService: AuthService, private snack: MatSnackBar) {
  }

  ngOnInit() {
  }

  sendRegisterCredentials() {
    this.authService.signup(this.registerForm.get('firstNameController').value,
      this.registerForm.get('lastNameController').value,
      this.registerForm.get('emailController').value,
      this.registerForm.get('passwordController').value);
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

  // @PARAM confirmation is FromGroup
  passwordConfirmationMatchValidator(confirmation: AbstractControl) {
    return (confirmation.get('passwordController').value === confirmation.get('passwordConfirmController').value)
      ? null : {'passwordDontMatch': true};
  }

  notForbiddenPassword(confirmation: AbstractControl) {
    return (confirmation.value.toLocaleString().toLocaleLowerCase() !== 'abc123') ? null : {'dumbUser': true};
  }
}
