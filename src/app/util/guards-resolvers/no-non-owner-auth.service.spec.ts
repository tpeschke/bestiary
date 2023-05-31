import { TestBed } from '@angular/core/testing';

import { NoNonOwnerService } from './no-non-owner-auth.service';

describe('NoNonOwnerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NoNonOwnerService = TestBed.get(NoNonOwnerService);
    expect(service).toBeTruthy();
  });
});


