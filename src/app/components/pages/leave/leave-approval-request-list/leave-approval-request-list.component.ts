import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApprovalFlowDialogComponent } from '../../../../shared/widget/dialog/approval-flow-dialog/approval-flow-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ApplyLeaveComponent } from '../apply-leave/apply-leave.component';
import { SHARED_MATERIAL_MODULES } from '../../../../shared/common/shared-material';
import { ApiService } from '../../../../shared/service/api/api.service';
import { CommonService } from '../../../../shared/service/common/common.service';
import { API_ENDPOINTS } from '../../../../shared/common/api-contant';

@Component({
  selector: 'app-leave-approval-request-list',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './leave-approval-request-list.component.html',
  styleUrl: './leave-approval-request-list.component.scss',
})
export class LeaveApprovalRequestListComponent {
  leaveRequests: Array<any> = [];
  EmployeeNo: any;
  RoleName: any;
  UserEmail: any;
  pendingLeaveCount: number = 0;

  leaveType: Array<any> = [];
  leaveReasonType: Array<any> = [];

  displayedColumns: string[] = [
    'srno',
    'empNo',
    'name',
    'fromDate',
    'toDate',
    'view',
  ];

  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
    private dialog: MatDialog,
    private activateRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getEmployeeLeaveRequestList();
    this.getparams();
  }

  getparams() {
    this.activateRoute.data.subscribe((params) => {
      // console.log('Params Leave Management ---->', params);

      if (params['data']) {
        this.leaveType = params['data'].leaveType?.data?.types || [];
        this.leaveType = this.leaveType.map((item) => {
          return {
            value: item.typeValue,
            label: item.typeLabel,
          };
        });

        console.log('Leave Type--->', this.leaveType);

        this.leaveReasonType =
          params['data'].leaveReasonType?.data?.types || [];
        this.leaveReasonType = this.leaveReasonType.map((item) => {
          return {
            value: item.typeValue,
            label: item.typeLabel,
          };
        });

        console.log('Leave Reason Type--->', this.leaveReasonType);
      }
    });
  }

  getEmployeeLeaveRequestList() {
    const currentUser = this.commonService.getCurrentUserDetails();

    const paylaod = {
      approverEmpNo: currentUser.empNo || '',
    };

    console.log('SERVICE_GET_USER_ATTENDENCE paylaod', {});

    this.apiService
      .postApiCall(
        API_ENDPOINTS.SERVICE_GET_EMPLOYEE_LEAVE_REQUEST_LIST,
        paylaod
      )
      .subscribe({
        next: (res: any) => {
          console.log(
            `${API_ENDPOINTS.SERVICE_GET_LEAVE_REQUEST_APPROVER} Response : `,
            res
          );

          this.leaveRequests = res?.data.leaves || [];
          console.log(this.leaveRequests);

          this.commonService.openSnackbar(res.message, 'success');
        },
        error: (error) => {
          this.commonService.openSnackbar(error.error.message, 'error');
        },
      });
  }

  openViewApproval(leave: any) {
    this.dialog
      .open(ApplyLeaveComponent, {
        width: '500px',
        disableClose: true,
        data: {
          mode: 'view',
          leaveRequest: leave,
          leaveType: this.leaveType,
          leaveReasonType: this.leaveReasonType,
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.getEmployeeLeaveRequestList();
        }
      });
  }

  
}
