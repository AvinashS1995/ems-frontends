import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMeetingSchedulesComponent } from './create-meeting-schedules.component';

describe('CreateMeetingSchedulesComponent', () => {
  let component: CreateMeetingSchedulesComponent;
  let fixture: ComponentFixture<CreateMeetingSchedulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMeetingSchedulesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMeetingSchedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
