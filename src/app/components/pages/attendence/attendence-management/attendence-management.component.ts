import {
  Component,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { interval, Subscription } from 'rxjs';
import { CheckInsComponent } from '../check-ins/check-ins.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SHARED_MATERIAL_MODULES } from '../../../../shared/common/shared-material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { CommonService } from '../../../../shared/service/common/common.service';
import { ApiService } from '../../../../shared/service/api/api.service';
import { API_ENDPOINTS } from '../../../../shared/common/api-contant';
import { PageEvent } from '@angular/material/paginator';

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

export interface AttendanceRecord {
  date: string;
  name: string;
  role: string;
  employmentType: string;
  status: string;
  checkIn: string;
  checkOut: string;
  photo: string;
}

@Component({
  selector: 'app-attendence-management',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES, CommonModule],
  templateUrl: './attendence-management.component.html',
  styleUrl: './attendence-management.component.scss',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class AttendenceManagementComponent {


  employeeAttendenceFilterForm!: FormGroup;

  displayedColumns: string[] = [
    'date',
    'employee',
    'role',
    'employmentType',
    'status',
    'checkIn',
    'checkOut',
  ];
  dataSource: Array<any> = [];

  UserEmail: string = '';
  RoleName: string = '';

  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  private timerSubscription!: Subscription;
  // private isBrowser: boolean;
  hasCheckedIn: any;

  totalRecords = 0;
  pageSize = 5;
  currentPage: number = 1;
  totalEmployee: any;
  presentEmployee: any;
  absentEmployee: any;
  lateEmployee: any;

  attendenceStatuse: Array<any> = [];
  todayAttendenceSummary: any;

  constructor(
    private commonService: CommonService,
    private apiService: ApiService,
    private activateRoute: ActivatedRoute,
    private fb: FormBuilder,
    private dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    
    // if (this.isBrowser) {
    //   this.startTimer();
    // }
    this.prepareEmployeeAttendenceFilterForm();
    this.getparams();
    this.getWorkSummary();
    this.getEmployeeAttendence();
  }

  getparams() {

    this.activateRoute.data.subscribe((params) => {
      console.log("Attendence Params ---->", params);

      if(params['data']) {

        this.attendenceStatuse = params['data'].attendenceStatus?.data?.types || [];
        this.attendenceStatuse = this.attendenceStatuse.map((item) => {
          return {
            value: item.typeValue,
            label: item.typeLabel,
          };
        });

        console.log("Attendence Statuse---->", this.attendenceStatuse);

        this.todayAttendenceSummary = params['data'].todayAttendenceSummary?.summary || {};
        console.log("todayAttendenceSummary ---->",this.todayAttendenceSummary);
        
        
      }
      
    })
  }

  prepareEmployeeAttendenceFilterForm() {
    this.employeeAttendenceFilterForm = this.fb.group({
          name: ['',],
          attendenceStatus: [''],
          startDate: [''],
          endDate: [''],
    })
  }

  getEmployeeAttendence() {

    const { name, attendenceStatus, startDate, endDate} = this.employeeAttendenceFilterForm.getRawValue();
    const paylaod = {
      name: name ? name : '',
      email: this.commonService.getCurrentUserDetails().email ? this.commonService.getCurrentUserDetails().email : '',
      role: this.commonService.getCurrentUserDetails().role ? this.commonService.getCurrentUserDetails().role : '',
      status: attendenceStatus ? attendenceStatus : '',
      startDate: startDate ? startDate : '',
      endDate: endDate ? endDate : '',
      page: this.currentPage,
      limit: this.pageSize
    };

console.log("SERVICE_GET_USER_ATTENDENCE paylaod", paylaod)

    this.apiService
      .postApiCall(API_ENDPOINTS.SERVICE_GET_USER_ATTENDENCE, paylaod)
      .subscribe({
        next: (res: any) => {
          console.log(
            `${API_ENDPOINTS.SERVICE_GET_USER_ATTENDENCE} Response : `,
            res
          );

          this.dataSource = res?.data?.employeeAttendenceList || [];
          this.totalRecords = res.data.totalRecords || 0;
          // this.totalEmployee = res.data.totalEmployee || 0
          // this.presentEmployee = res.data.presentCount || 0
          // this.absentEmployee = res.data.absentCount || 0
          // this.lateEmployee = res.data.lateCount || 0

          this.commonService.openSnackbar(res.message, 'success');
        },
        error: (error) => {
          this.commonService.openSnackbar(error.error.message, 'error');
        },
      });
  }

  applyFilters() {
    this.getEmployeeAttendence();
  }

  clearFilters() {
    this.employeeAttendenceFilterForm.reset();
  }



  // startTimer() {
  //   this.timerSubscription = interval(1000).subscribe(() => {
  //     this.seconds++;

  //     if (this.seconds === 60) {
  //       this.seconds = 0;
  //       this.minutes++;
  //     }
  //     if (this.minutes === 60) {
  //       this.minutes = 0;
  //       this.hours++;
  //     }
  //   });
  // }

  getWorkSummary() {

    const paylaod = {
      email: this.commonService.getCurrentUserDetails().email ? this.commonService.getCurrentUserDetails().email : '',
      date: new Date().toISOString().split('T')[0]
    };



    this.apiService
      .postApiCall(API_ENDPOINTS.SERVICE_WORK_SUMMARY_ATTENDENCE, paylaod)
      .subscribe({
        next: (res: any) => {
          console.log(
            `${API_ENDPOINTS.SERVICE_WORK_SUMMARY_ATTENDENCE} Response : `,
            res
          );

          this.startTimerFrom(res.totalWorkSeconds);

          // this.commonService.openSnackbar(res.message, 'success');
        },
        error: (error) => {
          this.commonService.openSnackbar(error.error.message, 'error');
        },
      });
  }

  startTimerFrom(seconds: number) {
    this.hours = Math.floor(seconds / 3600);
    this.minutes = Math.floor((seconds % 3600) / 60);
    this.seconds = seconds % 60;
  
    this.timerSubscription = interval(1000).subscribe(() => {
      this.incrementTimer();
    });
  }
  
  incrementTimer() {
    this.seconds++;
    if (this.seconds === 60) {
      this.seconds = 0;
      this.minutes++;
    }
    if (this.minutes === 60) {
      this.minutes = 0;
      this.hours++;
    }
  }

  openCheckOutsDialog() {
    if (typeof window !== 'undefined') {
      this.hasCheckedIn = sessionStorage.getItem('checkIns');
    }

    if (this.hasCheckedIn) {
      const dialogRef = this.dialog.open(CheckInsComponent, {
        width: '500px',
        disableClose: true,
        data: { mode: 'checkout' },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'checkout') {
          this.getEmployeeAttendence();
        }
      });
    }
  }

  onPageChange(event: PageEvent): void {
      this.currentPage = event.pageIndex + 1;
      this.pageSize = event.pageSize;
      this.getEmployeeAttendence();
    }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
