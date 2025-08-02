import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { Subject } from 'rxjs';
import { CommonService } from '../../../../shared/service/common/common.service';
import { ApiService } from '../../../../shared/service/api/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_MATERIAL_MODULES } from '../../../../shared/common/shared-material';
import { API_ENDPOINTS } from '../../../../shared/common/api-contant';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-create-meeting-schedules',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './create-meeting-schedules.component.html',
  styleUrl: './create-meeting-schedules.component.scss',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class CreateMeetingSchedulesComponent {
  private destroy$ = new Subject<void>();

  createMeetingForm!: FormGroup;
  editMode: boolean = false;
  descriptionLength = 0;

  allEmployeeList = [
    { label: 'Abhay Raichand - [EMP001]', value: 'EMP001' },
    { label: 'Avinash Suryawanshi - [EMP002]', value: 'EMP002' },
    { label: 'Kapil Ingle - [EMP003]', value: 'EMP003' },
    { label: 'Suraj Narwade - [EMP004]', value: 'EMP004' },
  ];

  constructor(
    private commonService: CommonService,
    private apiService: ApiService,
    private activateRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.prepareCreatePopupConfigForm();
  }

  prepareCreatePopupConfigForm() {
    this.createMeetingForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      meetingType: ['Offline', Validators.required],
      platform: ['Google Meet'],
      location: [''],
      description: [''],
      attendees: [[], Validators.required],
    });

    this.setSubscription();
  }

  setSubscription() {
    this.createMeetingForm
      .get('meetingType')
      ?.valueChanges.subscribe((value) => {
        if (value === 'Online') {
          this.createMeetingForm.get('location')?.setValue('Google Meet');
          this.createMeetingForm
            .get('platform')
            ?.setValidators([Validators.required]);
        } else {
          this.createMeetingForm.get('location')?.reset();
          this.createMeetingForm.get('platform')?.clearValidators();
          this.createMeetingForm.get('platform')?.updateValueAndValidity();
        }
      });

    this.createMeetingForm.controls['description'].valueChanges.subscribe(
      (Meetingdescription) => {
        this.descriptionLength = Meetingdescription?.length || 0;
      }
    );
  }

  onSubmitMeetingForm() {
    const formValue = this.createMeetingForm.value;

    const payload = {
      ...formValue,
      empNo: this.commonService.getCurrentUserDetails().empNo || '',
      attendees: formValue.attendees.map((empNo: string) => ({ empNo })),
    };

    console.log('Submitting Meeting:', payload);

    this.apiService
      .postApiCall(API_ENDPOINTS.SERVICE_SAVE_MEETING_SCHEDULE, payload)
      .subscribe({
        next: (res: any) => {
          console.log(
            `${API_ENDPOINTS.SERVICE_SAVE_MEETING_SCHEDULE} Response : `,
            res
          );

          this.commonService.openSnackbar(res.message, 'success');
          this.router.navigateByUrl('/meeting-schedule-list');
        },
        error: (error) => {
          this.commonService.openSnackbar(error.error.message, 'error');
        },
      });
  }

  cancelMeeting() {
    this.router.navigateByUrl('/meeting-schedule-list');
  }

  updateDescriptionLength() {
    const value = this.createMeetingForm.get('description')?.value;
    this.descriptionLength = value?.length || 0;
  }
}
