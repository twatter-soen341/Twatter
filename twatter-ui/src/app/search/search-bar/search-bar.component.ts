import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import {
  map,
  switchMap,
  distinctUntilChanged,
  debounceTime
} from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { User } from '../../models/auth.model';
import { TwatsService } from '../../services/twat.service';
import { Twat } from '../../models/twat.model';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements AfterViewInit, OnDestroy {
  @ViewChild('filter') filter: ElementRef;
  keyUpSub: Subscription;
  users: { user: User; error: string };
  posts: { post: Twat; error: string }; // TODO: rename posts to twats
  userError = false;
  postError = false; // TODO rename postError to twatError
  value: string;

  constructor(
    private router: Router,
    private userService: UserService,
    private postService: TwatsService // TODO rename postService to twatService
  ) {}

  /* debounceTime and distinctUnilChange
   * used to limit the number of api queries
   */
  ngAfterViewInit() {
    /* Searching Users */
    this.keyUpSub = fromEvent(this.filter.nativeElement, 'keyup')
      .pipe(
        debounceTime(200),
        map((event: Event) => (<HTMLInputElement>event.target).value),
        distinctUntilChanged(),
        switchMap(value => this.userService.searchUser(value))
      )
      .subscribe(data => {
        this.userError = false;
        if (data.message) {
          this.users = null;
          this.userError = true;
        } else {
          this.users = data.slice(0, 4);
        }
      });
    /* Searching Posts */
    this.keyUpSub = fromEvent(this.filter.nativeElement, 'keyup')
      .pipe(
        debounceTime(200),
        map((event: Event) => (<HTMLInputElement>event.target).value),
        distinctUntilChanged(),
        switchMap(value => this.postService.searchTwat(value))
      )
      .subscribe(
        data => {
          this.postError = false;
          if (data.message) {
            this.posts = null;
            this.postError = true;
          } else {
            this.posts = data;
          }
        },
        error => {
          this.posts = null;
          this.postError = true;
        }
      );
  }

  ngOnDestroy() {
    this.keyUpSub.unsubscribe();
  }

  getResults(form: NgForm) {
    if (form.value.search) {
      this.router.navigate([`/search/${form.value.search}`]);
      const searchTerm = form.value.search;
      form.reset();
      this.users = null;
      this.posts = null;
      this.userError = false;
      this.postError = false;
      this.router.navigate([`/search/${searchTerm}`]);
    }
  }

  goToProfile(userId: string) {
    this.router.navigate(['/profile', userId]);
  }

  clearResults(form: NgForm) {
    setTimeout(() => {
      form.reset();
      this.users = null;
      this.posts = null;
      this.userError = false;
      this.postError = false;
    }, 500);
  }
}
