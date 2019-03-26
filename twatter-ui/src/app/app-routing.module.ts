import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {TwatlineComponent} from './components/feed/twatline/twatline.component';
import {ProfileComponent} from './components/profile/profile.component';
import {SearchResultsComponent} from './components/search/search-results/search-results.component';

import {AuthGuard} from './components/guards/auth.guard';
import {LoggedInGuard} from './components/guards/loggedIn.guard';
import {SettingsComponent} from './components/settings/settings.component';
import { FollowingPostComponent } from './components/feed/following-post/following-post.component';

const routes: Routes = [
  {path: 'register', component: RegisterComponent, canActivate: [LoggedInGuard]},
  {path: 'login', component: LoginComponent, canActivate: [LoggedInGuard]},
  {path: '', redirectTo: '/posts', pathMatch: 'full'},
  {path: 'profile/:id', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'posts', component: TwatlineComponent, canActivate: [AuthGuard]},
  {path: 'search/:search', component: SearchResultsComponent, canActivate: [AuthGuard]},
  {path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]},
  {path: 'followers/:id', component: FollowingPostComponent, canActivate: [AuthGuard]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, LoggedInGuard]
})
export class AppRoutingModule {
}
