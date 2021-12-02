import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObstacleCatalogComponent } from './obstacle-catalog.component';

describe('ObstacleCatalogComponent', () => {
  let component: ObstacleCatalogComponent;
  let fixture: ComponentFixture<ObstacleCatalogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObstacleCatalogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObstacleCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
