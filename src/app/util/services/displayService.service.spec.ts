/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DisplayServiceService } from './displayService.service';

describe('Service: DisplayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DisplayServiceService]
    });
  });

  it('should ...', inject([DisplayServiceService], (service: DisplayServiceService) => {
    expect(service).toBeTruthy();
  }));
});
