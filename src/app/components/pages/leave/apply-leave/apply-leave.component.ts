import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RejectCommentDialogComponent } from '../../../../shared/widget/dialog/reject-comment-dialog/reject-comment-dialog.component';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { SHARED_MATERIAL_MODULES } from '../../../../shared/common/shared-material';
import { ApiService } from '../../../../shared/service/api/api.service';
import { CommonService } from '../../../../shared/service/common/common.service';
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
  selector: 'app-apply-leave',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './apply-leave.component.html',
  styleUrl: './apply-leave.component.scss',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class ApplyLeaveComponent {
  selectedDate: Date | null = null;

  leaveForm!: FormGroup;

  leaveTypeList: Array<any> = [];
  leaveReasonTypeList: Array<any> = [];

  dialogTitle = 'Apply Leave';
  isViewMode = false;
  EmployeeName: any;
  RoleName: any;
  EmployeeNo: any;
  holidayDates: Array<any> = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private commonService: CommonService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.prepareCreateLeaveForm();
    this.leaveTypeList = this.data.leaveType || [];

    // console.log(this.leaveTypeList);

    this.leaveReasonTypeList = this.data.leaveReasonType || [];

    this.holidayDates = this.data?.upcomingHolidays

    console.log(this.holidayDates)

    // console.log(this.leaveReasonTypeList);
    this.setsubcription();
  }

  prepareCreateLeaveForm() {
    this.leaveForm = this.fb.group({
      employeeNoWithName: [' ', Validators.required],
      leaveType: [' ', Validators.required],
      leaveDuration: [' ', Validators.required],
      startDate: [' ', Validators.required],
      endDate: [' ', Validators.required],
      leaveReasonType: [' ', Validators.required],
      leaveReasonComment: [' ', Validators.required],
    });

    if (this.data?.mode === 'view' && this.data?.leaveRequest) {
      this.isViewMode = true;
      this.dialogTitle = 'View Leave Details';

      const {
        empNo,
        name,
        leaveType,
        leaveDuration,
        fromDate,
        toDate,
        reasonType,
        reasonComment,
      } = this.data.leaveRequest;

      this.leaveForm.patchValue({
        employeeNoWithName: `${name} [${empNo}]`,
        leaveType: leaveType,
        leaveDuration: leaveDuration,
        startDate: fromDate,
        endDate: toDate,
        leaveReasonType: reasonType,
        leaveReasonComment: reasonComment,
      });

      
      this.leaveForm.disable();
    }

    if (!this.data?.mode) {
      const EmployeeNoWithName = `${this.commonService.userDetails.name} [${this.commonService.userDetails.empNo}]`;

      this.leaveForm.patchValue({
        employeeNoWithName: EmployeeNoWithName || '',
      });

      this.leaveForm.controls['employeeNoWithName'].disable();
    }
  }

  setsubcription() {
    this.leaveForm.controls['endDate'].valueChanges.subscribe(selectedEndDate => {
      if (selectedEndDate) {
        const { startDate, endDate } = this.leaveForm.getRawValue();
        const totalLeaveDays = this.calculateLeaveDays(startDate, endDate);

        console.log(totalLeaveDays);
        
      }
    })
  }

  dateFilter = (d: Date | null): boolean => {
    const date = d ? new Date(d) : new Date();
    const day = date.getDay();

    const isHoliday = this.holidayDates.some(holiday =>
      new Date(holiday.date).toDateString() === date.toDateString()
    );

    return day !== 0 && day !== 6 && !isHoliday; 
  };

  dateClass = (d: Date): MatCalendarCellCssClasses => {

    const date = new Date(d);
    const day = date.getDay(); 
    const dateStr = date.toDateString();

    // console.log(this.holidayDates)
    const holidayDate = this.holidayDates.map((holiday: any) =>
      new Date(holiday.date).toDateString()
    );
    // console.log(holidayDate);

    if (holidayDate.includes(dateStr)) {
      return 'holiday-date'; 
    } else if (day === 0) {
      return 'sunday-date'; 
    } else if (day === 6) {
      return 'saturday-date'; 
    } else {
      return '';
    }
  };

 calculateLeaveDays(fromDate: Date, toDate: Date): number {
  if (!fromDate || !toDate || fromDate > toDate) return 0;

  const holidayStrings = this.holidayDates.map(d => {
    const holiday = new Date(d);
    holiday.setHours(0, 0, 0, 0); // normalize
    return holiday.getTime();    // use timestamp
  });

  let count = 0;
  const current = new Date(fromDate);

  while (current <= toDate) {
    current.setHours(0, 0, 0, 0); // normalize current date

    const day = current.getDay(); // 0 = Sun, 6 = Sat
    const isWeekend = day === 0 || day === 6;
    const isHoliday = holidayStrings.includes(current.getTime());

    if (!isWeekend && !isHoliday) {
      count++;
    }

    current.setDate(current.getDate() + 1);
  }

  return count;
}


  ApplyLeave() {
    console.log(this.leaveForm.getRawValue());

    const {
      employeeNoWithName,
      leaveType,
      leaveDuration,
      startDate,
      endDate,
      leaveReasonType,
      leaveReasonComment,
    } = this.leaveForm.getRawValue();

    const payload = {
      empNo: employeeNoWithName ? this.commonService.userDetails.empNo : '',
      name: employeeNoWithName ? this.commonService.userDetails.name : '',
      leaveType: leaveType ? leaveType : '',
      leaveDuration: leaveDuration ? leaveDuration : '',
      fromDate: startDate ? startDate : '',
      toDate: endDate ? endDate : '',
      reasonType: leaveReasonType ? leaveReasonType : '',
      reasonComment: leaveReasonComment ? leaveReasonComment : '',
    };

    this.apiService
      .postApiCall(API_ENDPOINTS.SERVICE_SAVE_EMPLOYEE_LEAVE, payload)
      .subscribe({
        next: (res: any) => {
          console.log(
            `${API_ENDPOINTS.SERVICE_SAVE_EMPLOYEE_LEAVE} Response : `,
            res
          );

          this.commonService.openSnackbar(res.message, 'success');
          this.dialogRef.close('saved');
        },
        error: (error) => {
          this.commonService.openSnackbar(error.error.message, 'error');
        },
      });
  }

 

  approveReject(decision: 'Approved' | 'Rejected') {
    const { _id, name, empNo } = this.data.leaveRequest;
    if (decision === 'Approved') {
      
      const payload = {
        leaveId: _id || '',
        action: decision || '',
        role: this.commonService.userDetails.role || '',
        approverComment: 'Leave Approved',
        updatedBy: `${this.commonService.userDetails.name} [${this.commonService.userDetails.empNo}]` || '',
      };
      this.sendDecision(payload);
    }

    if (decision === 'Rejected') {
      const dialogRef = this.dialog.open(RejectCommentDialogComponent, {
        width: '400px',
      });

      dialogRef.afterClosed().subscribe((comment) => {
        if (comment) {
          const payload = {
            leaveId: _id || '',
            action: decision || '',
            role: this.commonService.userDetails.role || '',
            approverComment: comment,
            updatedBy: `${this.commonService.userDetails.name} [${this.commonService.userDetails.empNo}]` || '',
          };
          this.sendDecision(payload);
        }
      });
    }
  }

  sendDecision(payload: any) {
    console.log(payload);
    this.apiService
      .postApiCall(
        API_ENDPOINTS.SERVICE_SAVE_EMPLOYEE_LEAVE_APPLICATION_APPROVE_REJECT,
        payload
      )
      .subscribe({
        next: (res: any) => {
          this.commonService.openSnackbar(res.message, 'success');
          this.dialogRef.close('decision');
        },
        error: (err) => {
          this.commonService.openSnackbar(err.error.message, 'error');
        },
      });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
