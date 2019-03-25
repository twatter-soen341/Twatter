import {AppComponent} from './app.component';
import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {HeaderComponent} from './header/header.component';
// ------Feed Components-------
import {TwatCreateComponent, TwatCreateDialogComponent} from './feed/twats/twat-create/twat-create.component';
import {TwatListComponent, TwatEditDialogComponent} from './feed/twats/twat-list/twat-list.component';
import {TextareaAutosizeModule} from 'ngx-textarea-autosize';
import {NgScrollbarModule} from 'ngx-scrollbar';
import {TwatIconBtnComponent} from './icons/twat-icon-btn/twat-icon-btn.component';
import {TwatlineComponent} from './feed/twatline/twatline.component';

// ------     Login     -------
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {AuthInterceptor} from './auth-interceptor';
// ------     Profile     -------
import {ProfileComponent} from './profile/profile.component';
import {ScrollTopComponent} from './scroll-top/scroll-top.component';
import {SidebarComponent} from './profile/sidebar/sidebar.component';
// ------Angular Material------
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {
  MatInputModule,
  MatToolbarModule,
  MatCardModule,
  MatIconModule,
  MatDialogModule,
  MatDividerModule,
  MatSnackBarModule,
  MatAutocompleteModule,
  MatMenuModule,
  MatBadgeModule,
  MatTooltipModule
} from '@angular/material';
// ------Search Components------
import { DragScrollModule } from 'ngx-drag-scroll';
import { SearchBarComponent } from './search/search-bar/search-bar.component';
import { SearchResultsComponent } from './search/search-results/search-results.component';
import { SettingsComponent } from './settings/settings.component';
// ----Side Bar Settings in Setting Bar
import { SidebarSettingsComponent } from './settings/sidebar-settings/sidebar-settings.component';
import { MatTabsModule } from '@angular/material';
import { CommentComponent } from './feed/twats/comment/comment.component';
// ------Follow Button------
import { FollowButtonComponent } from './follow-button/follow-button.component';
import { FollowingPostComponent } from './feed/following-post/following-post.component';
import { DisplayUserListComponent } from './profile/display-user-list/display-user-list.component';





@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    TwatCreateComponent,
    TwatCreateDialogComponent,
    TwatListComponent,
    TwatIconBtnComponent,
    RegisterComponent,
    ProfileComponent,
    TwatEditDialogComponent,
    ScrollTopComponent,
    TwatlineComponent,
    SidebarComponent,
    SettingsComponent,
    SidebarSettingsComponent,
    SearchBarComponent,
    SearchResultsComponent,
    CommentComponent,
    FollowButtonComponent,
    FollowingPostComponent,
    DisplayUserListComponent,
 ],
  imports: [
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    TextareaAutosizeModule,
    NgScrollbarModule,
    MatDividerModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatMenuModule,
    DragScrollModule,
    MatTabsModule,
    MatTooltipModule

  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    TwatCreateDialogComponent,
    TwatEditDialogComponent
  ]
})
export class AppModule {
}
