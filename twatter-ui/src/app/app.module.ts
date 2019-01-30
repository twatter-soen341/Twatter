import { AppComponent } from './app.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
// ------Feed Components-------
import { PostCreateComponent, PostCreateDialogComponent } from './feed/posts/post-create/post-create.component';
import { PostListComponent } from './feed/posts/post-list/post-list.component';
import { TextareaAutosizeModule } from 'ngx-textarea-autosize';
import { TwatIconBtnComponent } from './icons/twat-icon-btn/twat-icon-btn.component';
// ------     Login     -------
import { LoginComponent } from './login/login.component';
// ------Angular Material------

import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  MatInputModule,
  MatCardModule,
  MatIconModule,
  MatDialogModule,
} from '@angular/material';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {RegisterComponent} from './register/register.component';




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    PostCreateComponent,
    PostCreateDialogComponent,
    PostListComponent,
    TwatIconBtnComponent,
    RegisterComponent
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
    TextareaAutosizeModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    PostCreateDialogComponent,
  ]
})
export class AppModule { }
