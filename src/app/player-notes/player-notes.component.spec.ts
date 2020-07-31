import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerNotesComponent } from './player-notes.component';

describe('PlayerNotesComponent', () => {
  let component: PlayerNotesComponent;
  let fixture: ComponentFixture<PlayerNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
