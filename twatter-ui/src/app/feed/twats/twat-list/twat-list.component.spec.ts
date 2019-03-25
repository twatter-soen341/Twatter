import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwatListComponent } from './twat-list.component';

describe('TwatListComponent', () => {
  let component: TwatListComponent;
  let fixture: ComponentFixture<TwatListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwatListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwatListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
