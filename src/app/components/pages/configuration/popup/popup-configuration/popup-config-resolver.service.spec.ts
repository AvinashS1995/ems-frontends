import { TestBed } from '@angular/core/testing';

import { PopupConfigResolverService } from './popup-config-resolver.service';

describe('PopupConfigResolverService', () => {
  let service: PopupConfigResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopupConfigResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
