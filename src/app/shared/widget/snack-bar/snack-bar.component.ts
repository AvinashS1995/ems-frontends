import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { SHARED_MATERIAL_MODULES } from '../../common/shared-material';

@Component({
  selector: 'app-snack-bar',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './snack-bar.component.html',
  styleUrl: './snack-bar.component.scss'
})
export class SnackBarComponent {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    public snackBarRef: MatSnackBarRef<SnackBarComponent>
  ) {}

  closeSnackbar() {
    this.snackBarRef.dismiss();
  }

}
