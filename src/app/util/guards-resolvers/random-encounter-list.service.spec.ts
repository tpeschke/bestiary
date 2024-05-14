/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RandomEncounterListService } from './random-encounter-list.service';

describe('Service: RandomEncounterList', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RandomEncounterListService]
    });
  });

  it('should ...', inject([RandomEncounterListService], (service: RandomEncounterListService) => {
    expect(service).toBeTruthy();
  }));
});
