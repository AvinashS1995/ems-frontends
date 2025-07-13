import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SHARED_MATERIAL_MODULES } from '../../../common/shared-material';
import { API_ENDPOINTS } from '../../../common/api-contant';
import { ApiService } from '../../../service/api/api.service';
import { ApprovalStep, StepperApiData } from '../../../interface/approval';


@Component({
  selector: 'app-approval-flow-dialog',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './approval-flow-dialog.component.html',
  styleUrl: './approval-flow-dialog.component.scss'
})
export class ApprovalFlowDialogComponent {

  approvalSteps: ApprovalStep[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { stepperData: StepperApiData[] },
    private dialogRef: MatDialogRef<ApprovalFlowDialogComponent>,
  ) {}

  ngOnInit(): void {
    debugger
    const stepperData = this.data?.stepperData || [];
    console.log(stepperData)

    this.approvalSteps = stepperData.map((step, i) => ({
      label: step.role,
      createdBy: i === 0 ? step.name : "",
      updatedBy: i > 0 ? step.name : "",
      status: step.status,
      comment: step.comments,
      date: step.actionDate ? new Date(step.actionDate) : null
    }));
  
  }

  close(): void {
    this.dialogRef.close();
  }
}
