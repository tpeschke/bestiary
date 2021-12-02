import { TestBed } from '@angular/core/testing';

import { ObstacleService } from './obstacle.service';

describe('ObstacleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ObstacleService = TestBed.get(ObstacleService);
    expect(service).toBeTruthy();
  });
});
