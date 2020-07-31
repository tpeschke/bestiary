import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeastViewPlayerComponent } from './beast-view-player.component';

describe('BeastViewPlayerComponent', () => {
  let component: BeastViewPlayerComponent;
  let fixture: ComponentFixture<BeastViewPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeastViewPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeastViewPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
