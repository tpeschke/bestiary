import { TestBed } from '@angular/core/testing';

import { NoGmAuthService } from './no-gm-auth.service';

describe('NoGmAuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NoGmAuthService = TestBed.get(NoGmAuthService);
    expect(service).toBeTruthy();
  });
});
