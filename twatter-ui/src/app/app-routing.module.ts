import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {TwatlineComponent} from './feed/twatline/twatline.component';
import {ProfileComponent} from './profile/profile.component';

import {AuthGuard} from './guards/auth.guard';
import {LoggedInGuard} from './guards/loggedIn.guard';
import {SettingsComponent} from './settings/settings.component';

const routes: Routes = [
  {path: 'register', component: RegisterComponent, canActivate: [LoggedInGuard]},
  {path: 'login', component: LoginComponent, canActivate: [LoggedInGuard]},
  {path: '', redirectTo: '/posts', pathMatch: 'full'},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'posts', component: TwatlineComponent, canActivate: [AuthGuard]},
  {path: 'settings', component: SettingsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, LoggedInGuard]
})
export class AppRoutingModule {
}

