import { TestBed } from '@angular/core/testing';

import { PlayerBeastResolverService } from './player-beast-resolver.service';

describe('PlayerBeastResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlayerBeastResolverService = TestBed.get(PlayerBeastResolverService);
    expect(service).toBeTruthy();
  });
});
