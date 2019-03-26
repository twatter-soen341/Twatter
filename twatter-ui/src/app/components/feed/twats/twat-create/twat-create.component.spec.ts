import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwatCreateComponent } from './twat-create.component';

describe('TwatCreateComponent', () => {
  let component: TwatCreateComponent;
  let fixture: ComponentFixture<TwatCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwatCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwatCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
