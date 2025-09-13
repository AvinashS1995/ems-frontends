import { Component } from '@angular/core';
import { API_ENDPOINTS } from '../../../../shared/common/api-contant';
import { SHARED_MATERIAL_MODULES } from '../../../../shared/common/shared-material';
import { CommonService } from '../../../../shared/service/common/common.service';
import { ApiService } from '../../../../shared/service/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { RejectCommentDialogComponent } from '../../../../shared/widget/dialog/reject-comment-dialog/reject-comment-dialog.component';

@Component({
  selector: 'app-assign-task-request-list',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './assign-task-request-list.component.html',
  styleUrl: './assign-task-request-list.component.scss',
})
export class AssignTaskRequestListComponent {
  assignTaskList: Array<any> = [];

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
      .postApiCall(API_ENDPOINTS.SERVICE_GET_TASKSBYPROJECTS, payload)
      .subscribe({
        next: (res: any) => {
          console.log(
            `${API_ENDPOINTS.SERVICE_GET_TASKSBYPROJECTS} Response : `,
            res
          );

          this.assignTaskList = res.data.tasks.map((task: any) => ({
            ...task,
            dropdownStatus: 'Pending',
          }));

          console.log('projects----->', this.assignTaskList);

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
    const { projectId, taskId } = element;
    const currentUser = this.commonService.getCurrentUserDetails();

    if (decision === 'Approved') {
      const payload = {
        projectId: projectId || '',
        taskId: taskId || '',
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
            projectId: projectId || '',
            taskId: taskId || '',
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
      .postApiCall(API_ENDPOINTS.SERVICE_TASK_ASSIGN_APPROVE_REJECT, payload)
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
