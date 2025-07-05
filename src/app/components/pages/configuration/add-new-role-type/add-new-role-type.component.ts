import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SHARED_MATERIAL_MODULES } from '../../../../shared/common/shared-material';
import { ApiService } from '../../../../shared/service/api/api.service';
import { CommonService } from '../../../../shared/service/common/common.service';
import { API_ENDPOINTS } from '../../../../shared/common/api-contant';

@Component({
  selector: 'app-add-new-role-type',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './add-new-role-type.component.html',
  styleUrl: './add-new-role-type.component.scss',
})
export class AddNewRoleTypeComponent {
  roleTypeForm!: FormGroup;

  roles: Array<any> = [];
  roleTypes: Array<any> = [];
  isEditMode: Boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private commonService: CommonService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AddNewRoleTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.prepareRoleTypeForm();

    this.roles = this.data.Roles || [];
  }

  prepareRoleTypeForm() {
    
    this.roleTypeForm = this.fb.group({
      role: ['', Validators.required],
      roleType: [''],
      description: [''],
    });

    if (this.data.editData) {
      this.isEditMode = true;
      this.roleTypeForm.patchValue({
        role: this.data.editData.entityValue,
        roleType: this.data.editData.typeLabel,
        description: this.data.editData.description,
      });
    }
  }

  onSubmitRoleType() {

    const { role, roleType, description } = this.roleTypeForm.getRawValue();

    if (this.roleTypeForm.valid) {
      // debugger
      const paylaod = {
        id: this.isEditMode ? this.data.editData?._id : 0,
        entityValue: role ? role : '',
        typeLabel: roleType ? roleType : '',
        description: description ? description : '',
      };

      console.log(paylaod);

      const ENDPOINT = this.data.editData
        ? API_ENDPOINTS.SERVICE_UPDATEROLETYPE
        : API_ENDPOINTS.SERVICE_SAVEROLETYPE;

      this.apiService.postApiCall(ENDPOINT, paylaod).subscribe({
        next: (res: any) => {
          console.log(`${ENDPOINT} Response : `, res);

          this.commonService.openSnackbar(res.message, 'success');
          this.dialogRef.close(this.data.editData ? 'updated' : 'saved');
        },
        error: (error) => {
          this.commonService.openSnackbar(error.error.message, 'error');
        },
      });
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
