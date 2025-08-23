import { TestBed } from '@angular/core/testing';

import { PayrollManagementResolverService } from './payroll-management-resolver.service';

describe('PayrollManagementResolverService', () => {
  let service: PayrollManagementResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayrollManagementResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
