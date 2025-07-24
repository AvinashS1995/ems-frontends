import { TestBed } from '@angular/core/testing';

import { CreatePopupConfigResolverService } from './create-popup-config-resolver.service';

describe('CreatePopupConfigResolverService', () => {
  let service: CreatePopupConfigResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreatePopupConfigResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
