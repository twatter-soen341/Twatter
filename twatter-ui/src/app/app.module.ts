import { AppComponent } from './app.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
// ------Feed Components-------
import { PostCreateComponent, PostCreateDialogComponent } from './feed/posts/post-create/post-create.component';
import { PostListComponent, PostEditDialogComponent } from './feed/posts/post-list/post-list.component';
import { TextareaAutosizeModule } from 'ngx-textarea-autosize';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { TwatIconBtnComponent } from './icons/twat-icon-btn/twat-icon-btn.component';
// ------     Login     -------
import { LoginComponent } from './login/login.component';
import {RegisterComponent} from './register/register.component';
import { AuthInterceptor } from './auth-interceptor';
// ------Angular Material------

import { MatFormFieldModule } from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatInputModule,
  MatToolbarModule,
  MatCardModule,
  MatIconModule,
  MatDialogModule,
  MatDividerModule,
  MatSnackBarModule
} from '@angular/material';
import { ProfileComponent } from './profile/profile.component';
import { ScrollTopComponent } from './scroll-top/scroll-top.component';




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
    ScrollTopComponent
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
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    PostCreateDialogComponent,
    PostEditDialogComponent
  ]
})
export class AppModule { }
