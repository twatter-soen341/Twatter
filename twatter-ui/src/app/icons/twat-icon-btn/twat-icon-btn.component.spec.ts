import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwatIconBtnComponent } from './twat-icon-btn.component';

describe('TwatIconBtnComponent', () => {
  let component: TwatIconBtnComponent;
  let fixture: ComponentFixture<TwatIconBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwatIconBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwatIconBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
