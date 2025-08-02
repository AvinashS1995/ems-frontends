import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SHARED_MATERIAL_MODULES } from '../../../common/shared-material';
import { CommonService } from '../../../service/common/common.service';

@Component({
  selector: 'app-events-dialog',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './events-dialog.component.html',
  styleUrl: './events-dialog.component.scss'
})
export class EventsDialogComponent {

   profileImage: string = '';
  defaultAvatar: string =
    'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png';


 constructor(
    public dialogRef: MatDialogRef<EventsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public commonService: CommonService
  ) {
    const currentUser = this.commonService.getCurrentUserDetails();
    this.profileImage = currentUser.profileImage
      ? currentUser.profileImage
      : this.defaultAvatar;
  
  }

  getColorByDay(date: Date): string {
    const day = new Date(date).getDay();
    switch (day) {
      case 0: return '#e74c3c'; // Sunday
      case 1: return '#2980b9'; // Monday
      case 2: return '#9b59b6'; // Tuesday
      case 3: return '#1abc9c'; // Wednesday
      case 4: return '#f1c40f'; // Thursday
      case 5: return '#2ecc71'; // Friday
      case 6: return '#e67e22'; // Saturday
      default: return '#7f8c8d'; // fallback
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
