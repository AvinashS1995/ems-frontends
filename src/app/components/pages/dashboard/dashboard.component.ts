import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
  AnimationEvent,
} from '@angular/animations';
import { SHARED_MATERIAL_MODULES } from '../../../shared/common/shared-material';
import { ApiService } from '../../../shared/service/api/api.service';
import { CommonService } from '../../../shared/service/common/common.service';
import { API_ENDPOINTS } from '../../../shared/common/api-contant';
import { CheckInsComponent } from '../attendence/check-ins/check-ins.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  animations: [
    trigger('scrollUp', [
      transition('* => *', [
        animate(
          '15s linear',
          keyframes([
            style({ transform: 'translateY(0%)', opacity: 1, offset: 0 }),
            style({ transform: 'translateY(-100%)', opacity: 0.5, offset: 1 }),
          ])
        ),
      ]),
    ]),
  ],
})
export class DashboardComponent {
  hasCheckedIn: any;
  animationState = false;
  pauseAnimation = false;
  upcomingHolidays: Array<any> = [];
  pendingRequestCount: any;
  employeeTaskList = [
    {
      taskname: 'Prepare Monthly Report',
      deadlinedate: new Date('2025-07-10'),
    },
    { taskname: 'Client Meeting', deadlinedate: new Date('2025-07-08') },
  ];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private activateRoute: ActivatedRoute,
    private apiService: ApiService,
    private fb: FormBuilder,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.openCheckIns();
    this.getparams();
    if (this.commonService.getCurrentUserDetails().role !== 'Employee') {
      this.getEmployeeRequestList();
    }
  }

  openCheckIns() {
    // debugger
    if (typeof window !== 'undefined') {
      this.hasCheckedIn = sessionStorage.getItem('checkIns');
    }

    if (!this.hasCheckedIn) {
      const dialogRef = this.dialog.open(CheckInsComponent, {
        width: '600px',
        disableClose: true,
        data: { mode: 'checkins' },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          console.log(result);
          this.showEmployeePopupIfAny();
        }
      });
    }
  }

  onAnimationDone(event: AnimationEvent) {
    this.animationState = !this.animationState;
  }

  getparams() {
    this.activateRoute.data.subscribe((params) => {
      // console.log('Params Leave Management ---->', params);

      if (params['data']) {
        this.upcomingHolidays =
          params['data'].getUpcomingHoliday?.data?.upComingHolidays || [];

        this.upcomingHolidays = this.getCurrentAndNextMonthHolidays(
          this.upcomingHolidays
        );
      }
    });
  }

  getCurrentAndNextMonthHolidays(holidays: any[]): any[] {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const nextMonth = (currentMonth + 1) % 12;
    const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;

    return holidays
      .map((holiday) => {
        const dateObj = new Date(holiday.date);
        return {
          ...holiday,
          dateObj,
          name: this.cleanName(holiday.name),
        };
      })
      .filter((holiday) => {
        const m = holiday.dateObj.getMonth();
        const y = holiday.dateObj.getFullYear();
        return (
          (m === currentMonth && y === currentYear) ||
          (m === nextMonth && y === nextMonthYear)
        );
      });
  }

  private cleanName(name: string): string {
    return name.replace(/\s*\(.*?\)/g, '').trim();
  }

  getEmployeeRequestList() {
    const currentUser = this.commonService.getCurrentUserDetails();

    const paylaod = {
      approverEmpNo: currentUser.empNo || '',
    };

    console.log('SERVICE_GET_EMPLOYEE_APPROVAL_REQUEST_LIST paylaod', paylaod);

    this.apiService
      .postApiCall(
        API_ENDPOINTS.SERVICE_GET_EMPLOYEE_APPROVAL_REQUEST_LIST,
        paylaod
      )
      .subscribe({
        next: (res: any) => {
          console.log(
            `${API_ENDPOINTS.SERVICE_GET_EMPLOYEE_APPROVAL_REQUEST_LIST} Response : `,
            res
          );

          this.pendingRequestCount = res?.totalRecords || '';

          this.commonService.openSnackbar(res.message, 'success');
        },
        error: (error) => {
          this.commonService.openSnackbar(error.error.message, 'error');
        },
      });
  }

  navigateToRequestList() {
    this.router.navigate(['/request-list']);
  }

  handleNotificationClick(): void {
    if (this.pendingRequestCount && this.pendingRequestCount > 0) {
      this.navigateToRequestList();
    }
  }

  showEmployeePopupIfAny(): void {
    const user = this.commonService.getCurrentUserDetails();

    const paylaod = {
      employee: user.empNo || '',
    };

    this.apiService
      .authApiCall(API_ENDPOINTS.SERVICE_GET_EMPLOYEE_POPUP_DETAILS, paylaod)
      .subscribe({
        next: (resp: any) => {
          const popups: any[] = resp?.data;
          console.log(popups);

          if (!popups || popups.length === 0) {
            return;
          }

          this.displayPopupSequence(popups, 0);
        },
        error: (error) => {
          console.error('Popup Fetch Error:', error);
        },
      });
  }

  displayPopupSequence(popups: any[], index: number): void {
    if (index >= popups.length) {
      return;
    }

    const popup = popups[index];

    if (popup.popupType === 'text') {
      this.commonService
        .showAlertDialog({
          title: popup.name,
          message: popup.textMessage || 'No message',
        })
        .subscribe(() => {
          this.displayPopupSequence(popups, index + 1);
        });
    } else {
      const fileUrl = popup.uploadedFile;
      const extension = this.commonService.returnFilenameExtension(fileUrl);

      const isImage = [
        'jpg',
        'jpeg',
        'png',
        'gif',
        'bmp',
        'webp',
        'svg',
      ].includes(extension || '');

      const dialogRef = isImage
        ? this.commonService.viewImageViewer(popup.uploadedFile, fileUrl)
        : this.commonService.viewDocumentViewer(popup.uploadedFile, fileUrl);

      dialogRef.afterClosed().subscribe(() => {
        this.displayPopupSequence(popups, index + 1);
      });
    }
  }
}
