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

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements AfterViewInit, OnDestroy {
  @ViewChild('filter') filter: ElementRef;
  keyUpSub: Subscription;
  users: { user: User; error: string };
  error = false;

  constructor(private userService: UserService) {}

  /* debounceTime and distinctUnilChange
   * used to limit the number of api queries
   */
  ngAfterViewInit() {
    this.keyUpSub = fromEvent(this.filter.nativeElement, 'keyup')
      .pipe(
        debounceTime(200),
        map((event: Event) => (<HTMLInputElement>event.target).value),
        distinctUntilChanged(),
        switchMap(value => this.userService.searchUser(value))
      )
      .subscribe(data => {
        this.error = false;
        if (data.message) {
          this.users = null;
          this.error = true;
        } else {
          this.users = data;
        }
      });
  }

  ngOnDestroy() {
    this.keyUpSub.unsubscribe();
  }
}
