import { Component, Inject } from '@angular/core';
import { CommonService } from '../../../../shared/service/common/common.service';
import { ApiService } from '../../../../shared/service/api/api.service';
import { SHARED_MATERIAL_MODULES } from '../../../../shared/common/shared-material';
import { API_ENDPOINTS } from '../../../../shared/common/api-contant';
import { RejectCommentDialogComponent } from '../../../../shared/widget/dialog/reject-comment-dialog/reject-comment-dialog.component';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-assign-project-request-list',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './assign-project-request-list.component.html',
  styleUrl: './assign-project-request-list.component.scss',
})
export class AssignProjectRequestListComponent {
  assignProjectList: Array<any> = [];

  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'priority',
    'createdBy',
    'timeline',
    'view',
    'status',
  ];

  constructor(
    private commonService: CommonService,
    private apiService: ApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.applyFilters();
  }

  applyFilters() {
    const empNo = this.commonService.getCurrentUserDetails().empNo || '';
    const payload = {
      empNo: empNo,
    };

    this.apiService
      .postApiCall(API_ENDPOINTS.SERVICE_GET_PROJETS, payload)
      .subscribe({
        next: (res: any) => {
          console.log(`${API_ENDPOINTS.SERVICE_GET_PROJETS} Response : `, res);

          this.assignProjectList = (res.data.projects || []).map(
            (proj: any) => {
              const approver = proj.approvalStatus.find(
                (a: any) => a.empNo === empNo
              );

              return {
                ...proj,
                dropdownStatus:
                  approver?.status === 'Pending'
                    ? 'Select Approval'
                    : approver?.status,
              };
            }
          );
          console.log('projects----->', this.assignProjectList);

          this.commonService.openSnackbar(res.message, 'success');
        },
        error: (error) => {
          this.commonService.openSnackbar(error.error.message, 'error');
        },
      });
  }

  onViewDocument(filepath?: any, filename?: string) {
    if (filename !== '' && filepath) {
      const url = filepath;
      if (filepath) {
        this.commonService.onViewDocument(filename, url);
      } else {
        this.commonService.openSnackbar(
          'No image available to preview',
          'error'
        );
      }
    } else {
      this.commonService.openSnackbar(
        'No Project design is available to preview',
        'error'
      );
    }
  }

  updateTaskStatus(element: any, newStatus: string) {
    const previousValue = element.dropdownStatus;

    element.dropdownStatus = newStatus;

    console.log(element.dropdownStatus);
    this.approveReject(element, newStatus, previousValue);
  }

  approveReject(element: any, decision: string, previousValue: string) {
    const { projectId } = element;
    const currentUser = this.commonService.getCurrentUserDetails();

    if (decision === 'Approved') {
      const payload = {
        projectId: projectId || '',
        action: decision || '',
        comments: 'Project Approved',
        approverEmpNo: currentUser.empNo || '',
      };
      console.log(payload);

      this.sendDecision(payload);
    }

    if (decision === 'Rejected') {
      const dialogRef = this.dialog.open(RejectCommentDialogComponent, {
        width: '400px',
        data: {
          title: 'Reject Project Request',
        },
      });

      dialogRef.afterClosed().subscribe((comment) => {
        if (comment) {
          const payload = {
            leaveId: projectId || '',
            action: decision || '',
            comments: comment || '',
            approverEmpNo: currentUser.empNo || '',
          };

          console.log(payload);

          this.sendDecision(payload);
        } else {
          element.dropdownStatus = previousValue;
          this.applyFilters();
        }
      });
    }
  }

  sendDecision(payload: any) {
    console.log(payload);
    this.apiService
      .postApiCall(API_ENDPOINTS.SERVICE_PROJETS_ASSIGN_APPROVE_REJECT, payload)
      .subscribe({
        next: (res: any) => {
          this.applyFilters();
          this.commonService.openSnackbar(res.message, 'success');
        },
        error: (err) => {
          this.commonService.openSnackbar(err.error.message, 'error');
        },
      });
  }
}
