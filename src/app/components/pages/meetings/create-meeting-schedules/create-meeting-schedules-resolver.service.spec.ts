import { TestBed } from '@angular/core/testing';

import { CreateMeetingSchedulesResolverService } from './create-meeting-schedules-resolver.service';

describe('CreateMeetingSchedulesResolverService', () => {
  let service: CreateMeetingSchedulesResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateMeetingSchedulesResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
