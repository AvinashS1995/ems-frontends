import { TestBed } from '@angular/core/testing';

import { LeaveManagementResolverService } from './leave-management-resolver.service';

describe('LeaveManagementResolverService', () => {
  let service: LeaveManagementResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeaveManagementResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
