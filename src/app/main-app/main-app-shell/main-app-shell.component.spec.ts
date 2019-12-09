import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainAppShellComponent } from './main-app-shell.component';

describe('MainAppShellComponent', () => {
  let component: MainAppShellComponent;
  let fixture: ComponentFixture<MainAppShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainAppShellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainAppShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
