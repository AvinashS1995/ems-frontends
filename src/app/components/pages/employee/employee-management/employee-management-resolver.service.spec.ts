import { TestBed } from '@angular/core/testing';

import { EmployeeManagementResolverService } from './employee-management-resolver.service';

describe('EmployeeManagementResolverService', () => {
  let service: EmployeeManagementResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeManagementResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
