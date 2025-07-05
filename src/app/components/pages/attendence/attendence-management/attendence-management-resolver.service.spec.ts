import { TestBed } from '@angular/core/testing';

import { AttendenceManagementResolverService } from './attendence-management-resolver.service';

describe('AttendenceManagementResolverService', () => {
  let service: AttendenceManagementResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttendenceManagementResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
