import { TestBed } from '@angular/core/testing';

import { CreateProjectTaskResolverService } from './create-project-task-resolver.service';

describe('CreateProjectTaskResolverService', () => {
  let service: CreateProjectTaskResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateProjectTaskResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
