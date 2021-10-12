import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeirdShapingEditComponent } from './weird-shaping-edit.component';

describe('WeirdShapingEditComponent', () => {
  let component: WeirdShapingEditComponent;
  let fixture: ComponentFixture<WeirdShapingEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeirdShapingEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeirdShapingEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
