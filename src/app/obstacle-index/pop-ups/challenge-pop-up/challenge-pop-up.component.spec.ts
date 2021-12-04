import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengePopUpComponent } from './challenge-pop-up.component';

describe('ChallengePopUpComponent', () => {
  let component: ChallengePopUpComponent;
  let fixture: ComponentFixture<ChallengePopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChallengePopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengePopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
