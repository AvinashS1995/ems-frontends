import { Component, Inject } from '@angular/core';
import { SHARED_MATERIAL_MODULES } from '../../../common/shared-material';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmployeeWish } from '../../../interface/user';

export interface EmployeeWishesDialogData {
  employeeName: string;
  occasion: 'birthday' | 'anniversary' | 'newJoinee';
  wishes: EmployeeWish[];
  defaultAvatar: string;
}

@Component({
  selector: 'app-employee-wishes-dialog',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './employee-wishes-dialog.component.html',
  styleUrl: './employee-wishes-dialog.component.scss',
})
export class EmployeeWishesDialogComponent {
  defaultAvatar: string =
    'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png';

  constructor(
    private dialogRef: MatDialogRef<EmployeeWishesDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: EmployeeWishesDialogData,
  ) {}

  get occasionTitle(): string {
    switch (this.data.occasion) {
      case 'birthday':
        return 'Birthday Wishes';

      case 'anniversary':
        return 'Work Anniversary Wishes';

      case 'newJoinee':
        return 'Welcome Wishes';

      default:
        return 'Wishes';
    }
  }

  get occasionIcon(): string {
    switch (this.data.occasion) {
      case 'birthday':
        return 'cake';

      case 'anniversary':
        return 'workspace_premium';

      case 'newJoinee':
        return 'waving_hand';

      default:
        return 'favorite';
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
