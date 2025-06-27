import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SHARED_MATERIAL_MODULES } from '../../../common/shared-material';

@Component({
  selector: 'app-reject-comment-dialog',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './reject-comment-dialog.component.html',
  styleUrl: './reject-comment-dialog.component.scss'
})
export class RejectCommentDialogComponent {

  rejectForm!: FormGroup;
  dialogTitle = 'Reject Request';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RejectCommentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.dialogTitle = this.data?.title || this.dialogTitle; 
    this.rejectForm = this.fb.group({
      comment: ['', Validators.required]
    });
  }

  submitReject() {
    if (this.rejectForm.valid) {
      this.dialogRef.close(this.rejectForm.value.comment);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
