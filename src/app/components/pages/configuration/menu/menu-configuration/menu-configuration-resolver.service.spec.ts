import { TestBed } from '@angular/core/testing';

import { MenuConfigurationResolverService } from './menu-configuration-resolver.service';

describe('MenuConfigurationResolverService', () => {
  let service: MenuConfigurationResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuConfigurationResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
