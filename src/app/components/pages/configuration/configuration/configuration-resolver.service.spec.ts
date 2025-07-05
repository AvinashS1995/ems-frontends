import { TestBed } from '@angular/core/testing';

import { ConfigurationResolverService } from './configuration-resolver.service';

describe('ConfigurationResolverService', () => {
  let service: ConfigurationResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigurationResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
