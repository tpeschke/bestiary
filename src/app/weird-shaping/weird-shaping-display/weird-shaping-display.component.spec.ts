import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeirdShapingDisplayComponent } from './weird-shaping-display.component';

describe('WeirdShapingDisplayComponent', () => {
  let component: WeirdShapingDisplayComponent;
  let fixture: ComponentFixture<WeirdShapingDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeirdShapingDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeirdShapingDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
