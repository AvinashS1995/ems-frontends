import { Component } from '@angular/core';
import { API_ENDPOINTS } from '../../../../shared/common/api-contant';
import { CommonService } from '../../../../shared/service/common/common.service';
import { CryptoService } from '../../../../shared/service/common/crypto.service';
import { ApiService } from '../../../../shared/service/api/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { SHARED_MATERIAL_MODULES } from '../../../../shared/common/shared-material';

@Component({
  selector: 'app-meeting-schedules',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './meeting-schedules.component.html',
  styleUrl: './meeting-schedules.component.scss',
})
export class MeetingSchedulesComponent {
  meetingScheduleFilterForm!: FormGroup;

  roleTypeList: Array<any> = [];
  meetingTypeList: Array<any> = [
    { value: '1', label: 'Offline' },
    { value: '2', label: 'Online' },
  ];

  meetingScheduleList: Array<any> = [];

  totalRecords = 0;
  pageSize = 5;
  currentPage: number = 1;

  displayedColumns: string[] = [
    'srNo',
    'name',
    'date',
    'meetingType',
    'time',
    'location',
    'attendees',
    'actions',
  ];

  constructor(
    private commonService: CommonService,
    private cryptoService: CryptoService,
    private apiService: ApiService,
    private activateRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.prepareMenuFilterForm();
    this.getparam();
    this.applyFilters();
  }

  prepareMenuFilterForm() {
    this.meetingScheduleFilterForm = this.fb.group({
      meetingType: [''],
    });
  }

  getparam() {
    this.activateRoute.data.subscribe((params) => {
      console.log('Title ---->', params);

      if (params['data']) {
        this.roleTypeList = params['data'].roles?.data?.types || [];
        this.roleTypeList = this.roleTypeList.map((item) => {
          return {
            value: item.typeValue,
            label: item.typeLabel,
          };
        });

        console.log('Roles--->', this.roleTypeList);
      }
    });
  }

  createMeeting() {
    this.router.navigateByUrl('/create-meeting-schedule');
  }

  applyFilters() {
    const { meetingType } = this.meetingScheduleFilterForm.getRawValue();

    const payload = {
      empNo: this.commonService.getCurrentUserDetails().empNo || '',
      meetingType: meetingType || '',
    };

    this.apiService
      .postApiCall(API_ENDPOINTS.SERVICE_GET_ALL_MEETING_SCHEDULE, payload)
      .subscribe({
        next: (res: any) => {
          console.log(
            `${API_ENDPOINTS.SERVICE_GET_ALL_MEETING_SCHEDULE} Response : `,
            res
          );

          this.meetingScheduleList = res.data.meetings || [];

          this.commonService.openSnackbar(res.message, 'success');
        },
        error: (error) => {
          this.commonService.openSnackbar(error.error.message, 'error');
        },
      });
  }

  clearFilters() {
    this.meetingScheduleFilterForm.reset();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.applyFilters();
  }

  onEdit(element: any): void {
    console.log('Edit:', element);
    const payload = {
      ...element,
      mode: 'edit',
    };
    this.router.navigate(['/create-popup-configuration'], {
      queryParams: {
        data: this.cryptoService.encrypt(payload),
      },
    });
  }

  onDelete(element: any): void {
    console.log('Delete:', element);

    const payload = {
      id: element ? element._id : '',
    };

    this.apiService
      .postApiCall(API_ENDPOINTS.SERVICE_DELETE_MEETING_SCHEDULE, payload)
      .subscribe({
        next: (res: any) => {
          console.log(
            `${API_ENDPOINTS.SERVICE_DELETE_MEETING_SCHEDULE} Response : `,
            res
          );

          this.commonService.openSnackbar(res.message, 'success');
          this.applyFilters();
        },
        error: (error) => {
          this.commonService.openSnackbar(error.error.message, 'error');
        },
      });
  }
}
