/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PatreonAuthService } from './patreon-auth.service';

describe('Service: PatreonAuth', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PatreonAuthService]
    });
  });

  it('should ...', inject([PatreonAuthService], (service: PatreonAuthService) => {
    expect(service).toBeTruthy();
  }));
});
