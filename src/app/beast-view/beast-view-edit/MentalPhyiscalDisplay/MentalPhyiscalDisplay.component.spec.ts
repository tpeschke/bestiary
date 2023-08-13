/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MentalPhyiscalDisplayComponent } from './MentalPhyiscalDisplay.component';

describe('MentalPhyiscalDisplayComponent', () => {
  let component: MentalPhyiscalDisplayComponent;
  let fixture: ComponentFixture<MentalPhyiscalDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MentalPhyiscalDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MentalPhyiscalDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
