import { TestBed } from '@angular/core/testing';

import { CatalogResolverService } from './catalog-resolver.service';

describe('CatalogResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CatalogResolverService = TestBed.get(CatalogResolverService);
    expect(service).toBeTruthy();
  });
});
