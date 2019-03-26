import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayUserListComponent } from './display-user-list.component';

describe('DisplayUserListComponent', () => {
  let component: DisplayUserListComponent;
  let fixture: ComponentFixture<DisplayUserListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayUserListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
