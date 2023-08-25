/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CombatSquareComponent } from './combat-square.component';

describe('CombatSquareComponent', () => {
  let component: CombatSquareComponent;
  let fixture: ComponentFixture<CombatSquareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombatSquareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombatSquareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
