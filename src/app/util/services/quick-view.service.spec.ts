import { TestBed } from '@angular/core/testing';

import { QuickViewService } from './quick-view.service';

describe('QuickViewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuickViewService = TestBed.get(QuickViewService);
    expect(service).toBeTruthy();
  });
});
