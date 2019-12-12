import { TestBed } from '@angular/core/testing';

import { NoPlayerAuthService } from './no-player-auth.service';

describe('NoPlayerAuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NoPlayerAuthService = TestBed.get(NoPlayerAuthService);
    expect(service).toBeTruthy();
  });
});
