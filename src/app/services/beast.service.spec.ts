import { TestBed } from '@angular/core/testing';

import { BeastService } from './beast.service';

describe('BeastService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BeastService = TestBed.get(BeastService);
    expect(service).toBeTruthy();
  });
});
