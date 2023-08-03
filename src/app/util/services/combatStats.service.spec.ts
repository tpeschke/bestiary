/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CombatStatsService } from './combatStats.service';

describe('Service: CombatStats', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CombatStatsService]
    });
  });

  it('should ...', inject([CombatStatsService], (service: CombatStatsService) => {
    expect(service).toBeTruthy();
  }));
});
