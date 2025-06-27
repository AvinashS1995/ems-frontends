import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SHARED_MATERIAL_MODULES } from '../../../common/shared-material';
import { API_ENDPOINTS } from '../../../common/api-contant';
import { ApiService } from '../../../service/api/api.service';

@Component({
  selector: 'app-approval-flow-dialog',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './approval-flow-dialog.component.html',
  styleUrl: './approval-flow-dialog.component.scss'
})
export class ApprovalFlowDialogComponent {

  approvalSteps: any[] = [];
  isLoading = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { leaveId: string },
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const payload = {
      leaveId: this.data.leaveId 
    }
  
    this.apiService.postApiCall(API_ENDPOINTS.SERVICE_APPLICATION_APPROVAL_FLOW, payload).subscribe({
      next: (res: any) => {
        const leave = res.data;
         this.approvalSteps = [];

      // Employee step
      this.approvalSteps.push({
        label: 'Employee',
        status: 'Submitted',
        comment: leave.reasonComment,
        createdBy: `${leave.empNo} - ${leave.name}`,
        date: leave.createAt
      });

      // TEAM LEADER step
      if (leave.leaveStatus.includes('Team Leader') || leave.leaveStatus.includes('Manager') || leave.leaveStatus.includes('HR') || leave.leaveStatus === 'Final Approved' || leave.leaveStatus.includes('Rejected')) {
        this.approvalSteps.push({
          label: 'Team Lead',
          status: leave.leaveStatus.includes('Team Leader') ? leave.leaveStatus : 'Approved',
          comment: leave.approverComment || '',
          updatedBy: leave.tlApprover,
          date: leave.updateAt
        });

        if (leave.leaveStatus.includes('Rejected')) return;
      }

      // MANAGER step
      if (leave.leaveStatus.includes('Manager') || leave.leaveStatus.includes('HR') || leave.leaveStatus === 'Final Approved') {
        this.approvalSteps.push({
          label: 'Manager',
          status: leave.leaveStatus.includes('Manager') ? leave.leaveStatus : 'Approved',
          comment: leave.approverComment || '',
          updatedBy: leave.managerApprover,
          date: leave.updateAt
        });

        if (leave.leaveStatus.includes('Rejected')) return;
      }

      // HR step
      if (leave.leaveStatus.includes('HR') || leave.leaveStatus === 'Final Approved') {
        this.approvalSteps.push({
          label: 'HR',
          status: leave.leaveStatus === 'Final Approved' ? 'Approved' : leave.leaveStatus,
          comment: leave.approverComment || '',
          updatedBy: leave.hrApprover,
          date: leave.updateAt
        });
      }
console.log("Approval Flow Response ---->",this.approvalSteps)
      this.isLoading = false;
    },

      error: () => {
        this.isLoading = false;
      },
    });
  }
}
