import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeastViewEditComponent } from './beast-view-edit.component';

describe('BeastViewEditComponent', () => {
  let component: BeastViewEditComponent;
  let fixture: ComponentFixture<BeastViewEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeastViewEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeastViewEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
