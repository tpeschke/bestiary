import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeastViewGmComponent } from './beast-view-gm.component';

describe('BeastViewGmComponent', () => {
  let component: BeastViewGmComponent;
  let fixture: ComponentFixture<BeastViewGmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeastViewGmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeastViewGmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
