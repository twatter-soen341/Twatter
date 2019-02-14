import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {FormControl, Validators, FormGroup} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({
    emailController: new FormControl('', [Validators.required]),
    passwordController: new FormControl('', [Validators.required])
  });
  hide_Password = true;

  constructor(private authService: AuthService, private snack: MatSnackBar, private router: Router) {
  }

  ngOnInit() {
  }

  sendLoginCredentials() {
    this.authService.login(
      this.loginForm.get('emailController').value,
      this.loginForm.get('passwordController').value
    ).subscribe(data => {

      const token = data.token;
      if (token) {
        this.authService.setToken(data);
        /* redirect to homepage */
        this.router.navigate(['/']);
      }
    }, (error) => {
      this.loginForm.reset('');
      this.snack.open('Could not login (error: ' + error.status + ')', 'Ok');
    });
  }

  showPassword() {
    this.hide_Password = false;
  }

  hidePassword() {
    this.hide_Password = true;
  }
}
