import { TestBed } from '@angular/core/testing';

import { LeaveApprovalRequestListResolverService } from './leave-approval-request-list-resolver.service';

describe('LeaveApprovalRequestListResolverService', () => {
  let service: LeaveApprovalRequestListResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeaveApprovalRequestListResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
