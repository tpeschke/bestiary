import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickViewDrawerComponent } from './quick-view-drawer.component';

describe('QuickViewDrawerComponent', () => {
  let component: QuickViewDrawerComponent;
  let fixture: ComponentFixture<QuickViewDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickViewDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickViewDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
