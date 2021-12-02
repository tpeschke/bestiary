import { TestBed } from '@angular/core/testing';

import { GetObstacleService } from './get-obstacle.service';

describe('GetObstacleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetObstacleService = TestBed.get(GetObstacleService);
    expect(service).toBeTruthy();
  });
});
