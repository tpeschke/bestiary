import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObstacleSearchComponent } from './obstacle-search.component';

describe('ObstacleSearchComponent', () => {
  let component: ObstacleSearchComponent;
  let fixture: ComponentFixture<ObstacleSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObstacleSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObstacleSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
