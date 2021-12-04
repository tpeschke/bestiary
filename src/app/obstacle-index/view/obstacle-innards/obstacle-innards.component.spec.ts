import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObstacleInnardsComponent } from './obstacle-innards.component';

describe('ObstacleInnardsComponent', () => {
  let component: ObstacleInnardsComponent;
  let fixture: ComponentFixture<ObstacleInnardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObstacleInnardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObstacleInnardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
