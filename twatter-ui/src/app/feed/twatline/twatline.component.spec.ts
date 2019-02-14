import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwatlineComponent } from './twatline.component';

describe('TwatlineComponent', () => {
  let component: TwatlineComponent;
  let fixture: ComponentFixture<TwatlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwatlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwatlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
