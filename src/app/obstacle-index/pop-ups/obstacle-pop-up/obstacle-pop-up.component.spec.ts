import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObstaclePopUpComponent } from './obstacle-pop-up.component';

describe('ObstaclePopUpComponent', () => {
  let component: ObstaclePopUpComponent;
  let fixture: ComponentFixture<ObstaclePopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObstaclePopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObstaclePopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
