import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObstacleEditComponent } from './obstacle-edit.component';

describe('ObstacleEditComponent', () => {
  let component: ObstacleEditComponent;
  let fixture: ComponentFixture<ObstacleEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObstacleEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObstacleEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
