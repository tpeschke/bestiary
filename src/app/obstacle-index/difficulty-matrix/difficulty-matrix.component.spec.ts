
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DifficultyMatrixComponent } from './difficulty-matrix.component';

describe('DifficultyMatrixComponent', () => {
  let component: DifficultyMatrixComponent;
  let fixture: ComponentFixture<DifficultyMatrixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DifficultyMatrixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DifficultyMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
