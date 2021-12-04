import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeShellComponent } from './challenge-shell.component';

describe('ChallengeShellComponent', () => {
  let component: ChallengeShellComponent;
  let fixture: ComponentFixture<ChallengeShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChallengeShellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengeShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
