import { TestBed } from '@angular/core/testing';

import { NoLoginAuthService } from './no-login-auth.service';

describe('NoLoginAuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NoLoginAuthService = TestBed.get(NoLoginAuthService);
    expect(service).toBeTruthy();
  });
});
