import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BestiaryHomeComponent } from './bestiary-home.component';

describe('BestiaryHomeComponent', () => {
  let component: BestiaryHomeComponent;
  let fixture: ComponentFixture<BestiaryHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BestiaryHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BestiaryHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
