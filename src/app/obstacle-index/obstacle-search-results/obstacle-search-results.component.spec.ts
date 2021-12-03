import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObstacleSearchResultsComponent } from './obstacle-search-results.component';

describe('ObstacleSearchResultsComponent', () => {
  let component: ObstacleSearchResultsComponent;
  let fixture: ComponentFixture<ObstacleSearchResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObstacleSearchResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObstacleSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
