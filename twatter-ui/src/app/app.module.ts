import {AppComponent} from './app.component';
import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {HeaderComponent} from './header/header.component';
// ------Feed Components-------
import {PostCreateComponent, PostCreateDialogComponent} from './feed/posts/post-create/post-create.component';
import {PostListComponent, PostEditDialogComponent} from './feed/posts/post-list/post-list.component';
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
import { SettingsComponent } from './settings/settings.component';
import {SearchBarComponent} from "./search/search-bar/search-bar.component";
// ----Side Bar Settings in Setting Bar
import { SidebarSettingsComponent } from './settings/sidebar-settings/sidebar-settings.component';
import { MatTabsModule } from '@angular/material';
import { CommentComponent } from './feed/posts/comment/comment.component';
import {SearchResultsComponent} from "./search/search-results/search-results.component";





@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    PostCreateComponent,
    PostCreateDialogComponent,
    PostListComponent,
    TwatIconBtnComponent,
    RegisterComponent,
    ProfileComponent,
    PostEditDialogComponent,
    ScrollTopComponent,
    TwatlineComponent,
    SidebarComponent,
    SettingsComponent,
    SidebarSettingsComponent,
    SearchBarComponent,
    SearchResultsComponent,
    CommentComponent
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
    PostCreateDialogComponent,
    PostEditDialogComponent
  ]
})
export class AppModule {
}
