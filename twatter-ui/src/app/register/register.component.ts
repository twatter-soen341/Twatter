import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {LoginService} from "../services/login.service";
import {MatSnackBar} from "@angular/material";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public formGroup = new FormGroup({
    nameController: new FormControl('', [Validators.required]),
    emailController: new FormControl('', [Validators.required, Validators.email]),
    passwordController: new FormControl('', [Validators.required, this.notForbiddenPassword]),
    passwordConfirmController: new FormControl('', [Validators.required, this.passwordConfirmationMatchValidator.bind(this)])
  });

  hide_Password = true;
  hide_Confirmation = true;

  constructor(private loginService: LoginService, private snack: MatSnackBar) {
  }

  ngOnInit() {
  }

  senndRegisterCredentials() {
    this.snack.open('Success log in', 'Ok', {duration: 1000});
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

  passwordConfirmationMatchValidator(confirmation: AbstractControl) {
    return (this.formGroup['passwordController'].value === confirmation.value) ? null : {'passwordDontMatch': true};
  }

  notForbiddenPassword(confirmation: AbstractControl) {
    return (confirmation.value.toLocaleString().toLocaleLowerCase() !== 'abc123') ? null : {'dumbUser': true};
  }


}
