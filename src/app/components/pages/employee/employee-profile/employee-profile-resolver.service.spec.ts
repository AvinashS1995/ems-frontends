import { TestBed } from '@angular/core/testing';

import { EmployeeProfileResolverService } from './employee-profile-resolver.service';

describe('EmployeeProfileResolverService', () => {
  let service: EmployeeProfileResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeProfileResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
