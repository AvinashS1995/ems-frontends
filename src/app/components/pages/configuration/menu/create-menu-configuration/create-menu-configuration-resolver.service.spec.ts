import { TestBed } from '@angular/core/testing';

import { CreateMenuConfigurationResolverService } from './create-menu-configuration-resolver.service';

describe('CreateMenuConfigurationResolverService', () => {
  let service: CreateMenuConfigurationResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateMenuConfigurationResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
