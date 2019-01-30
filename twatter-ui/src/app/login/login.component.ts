import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {LoginService} from '../services/login.service';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  emailController = new FormControl('');
  passwordController = new FormControl('');
  hide_Password = true;


  constructor(private loginService: LoginService, private snack: MatSnackBar) {}

  ngOnInit() {
  }

  sendLoginCredentials() {
    this.snack.open('Success log in',  'Ok', {duration: 1000});
  }

  showPassword() {
    this.hide_Password = false;
  }

  hidePassword() {
    this.hide_Password = true;
  }
}
