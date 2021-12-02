import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObstacleHomeComponent } from './obstacle-home.component';

describe('ObstacleHomeComponent', () => {
  let component: ObstacleHomeComponent;
  let fixture: ComponentFixture<ObstacleHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObstacleHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObstacleHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
