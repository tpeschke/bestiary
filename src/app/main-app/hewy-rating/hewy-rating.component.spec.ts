import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HewyRatingComponent } from './hewy-rating.component';

describe('HewyRatingComponent', () => {
  let component: HewyRatingComponent;
  let fixture: ComponentFixture<HewyRatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HewyRatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HewyRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
