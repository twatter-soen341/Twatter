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
import { UserService } from '../services/user.service';
import { User } from '../models/auth.model';
import { PostsService } from '../services/post.service';
import { Post } from '../models/post.model';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements AfterViewInit, OnDestroy {
  @ViewChild('filter') filter: ElementRef;
  keyUpSub: Subscription;
  users: { user: User; error: string };
  posts: { post: Post; error: string};
  userError = false;
  postError = false;

  constructor(private userService: UserService, private postService: PostsService) {}

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
          this.users = data;
        }
      });
    /* Searching Posts */
    this.keyUpSub = fromEvent(this.filter.nativeElement, 'keyup')
    .pipe(
      debounceTime(200),
      map((event: Event) => (<HTMLInputElement>event.target).value),
      distinctUntilChanged(),
      switchMap(value => this.postService.searchPost(value))
    )
    .subscribe(data => {
      this.postError = false;
      if (data.message) {
        this.posts = null;
        this.postError = true;
      } else {
        this.posts = data;
      }
    });
  }

  ngOnDestroy() {
    this.keyUpSub.unsubscribe();
  }
}
