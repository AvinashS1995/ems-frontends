import { TestBed } from '@angular/core/testing';

import { RequestListResolverService } from './request-list-resolver.service';

describe('RequestListResolverService', () => {
  let service: RequestListResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestListResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
