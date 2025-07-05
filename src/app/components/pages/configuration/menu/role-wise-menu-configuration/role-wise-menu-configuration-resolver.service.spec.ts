import { TestBed } from '@angular/core/testing';

import { RoleWiseMenuConfigurationResolverService } from './role-wise-menu-configuration-resolver.service';

describe('RoleWiseMenuConfigurationResolverService', () => {
  let service: RoleWiseMenuConfigurationResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleWiseMenuConfigurationResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
