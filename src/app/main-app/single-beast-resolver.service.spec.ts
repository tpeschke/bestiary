import { TestBed } from '@angular/core/testing';

import { SingleBeastResolverService } from './single-beast-resolver.service';

describe('SingleBeastResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SingleBeastResolverService = TestBed.get(SingleBeastResolverService);
    expect(service).toBeTruthy();
  });
});
