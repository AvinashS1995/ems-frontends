import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SHARED_MATERIAL_MODULES } from '../../../common/shared-material';
import { AlertDialogData } from '../../../interface/dialog';


@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './alert-dialog.component.html',
  styleUrl: './alert-dialog.component.scss'
})
export class AlertDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AlertDialogData
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
