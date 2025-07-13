import { TestBed } from '@angular/core/testing';

import { ApprovalConfigurationResolverService } from './approval-configuration-resolver.service';

describe('ApprovalConfigurationResolverService', () => {
  let service: ApprovalConfigurationResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApprovalConfigurationResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
