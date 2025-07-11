import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { SHARED_MATERIAL_MODULES } from '../../../../shared/common/shared-material';
import { ApiService } from '../../../../shared/service/api/api.service';
import { CommonService } from '../../../../shared/service/common/common.service';
import { REGEX } from '../../../../shared/common/constant';
import { API_ENDPOINTS } from '../../../../shared/common/api-contant';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES, CommonModule],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.scss',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class AddEmployeeComponent {
  employeeForm!: FormGroup;

  roles: Array<any> = [];
  statuses: Array<any> = [];
  selectedRole: string = '';
  experienceTypeList: Array<any> = [];
  designationList: Array<any> = [];
  workTypeList: Array<any> = [];

  isEditMode: Boolean = false;

  previewUrl: string | ArrayBuffer | null = null;
  defaultAvatar = 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png';
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private commonService: CommonService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AddEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.prepareAddEmployeeForm();
    // console.log(this.data);

    this.roles = this.data.Roles || [];

    this.statuses =
      this.data.Status.filter((role: any) => role.value !== 'All') || [];

    this.experienceTypeList = this.data.experienceLevel || [];

    console.log('Experience Level', this.experienceTypeList);

    this.designationList = this.data.designations || [];

    console.log('Designations', this.designationList);

    this.workTypeList = this.data.workType || [];

    console.log('Designations', this.designationList);
  }

  prepareAddEmployeeForm() {
    this.employeeForm = this.fb.group({
      profileImage: [''],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(REGEX.EMAIL_REGEX)]],
      mobile: [
        '',
        [Validators.required, Validators.pattern(REGEX.MOBILE_NUMBER_REGEX)],
      ],
      status: ['', Validators.required],
      type: [''],
      teamLeader: [''],
      manager: [''],
      hr: [''],
      role: [''],
      designation: [''],
      joiningDate: [''],
      salary: [0],
      workType: [''],
    });
debugger
    if (this.data.editData) {
      this.isEditMode = true;
      // debugger
      this.employeeForm.patchValue({
        name: this.data.editData.name,
        email: this.data.editData.email,
        mobile: this.data.editData.mobile,
        status: this.data.editData.status,
        type: this.data.editData.type,
        teamLeader: this.data.editData.teamLeader,
        manager: this.data.editData.manager,
        hr: this.data.editData.hr,
        role: this.data.editData.role,
        designation: this.data.editData.designation,
        joiningDate: this.data.editData.joiningDate,
        salary: this.data.editData.salary,
        workType: this.data.editData.workType,
        // profileImage: this.data.editData.profileImage

      });
      console.log(this.data.editData.profileImage)
      this.previewUrl = this.data.editData.profileImage;
       this.employeeForm.patchValue({ profileImage: this.previewUrl });
      // debugger
      // this.employeeForm.controls['email'].disable();
      // this.employeeForm.controls['mobile'].disable();

      console.log('Form---->', this.employeeForm.getRawValue());
    }
  }

  saveEmployee() {
    // debugger
    if (this.employeeForm.valid) {
      const newEmployee = this.employeeForm.getRawValue();


      console.log(newEmployee);

      const paylaod = {
        id: this.isEditMode ? this.data.editData?._id : 0,
        name: newEmployee.name ? newEmployee.name : '',
        email: newEmployee.email ? newEmployee.email : '',
        mobile: newEmployee.mobile ? newEmployee.mobile : '',
        role: newEmployee.role ? newEmployee.role : '',
        status: newEmployee.status ? newEmployee.status : '',
        type: newEmployee.type ? newEmployee.type : '',
        teamLeader: newEmployee.teamLeader ? newEmployee.teamLeader : '',
        manager: newEmployee.manager ? newEmployee.manager : '',
        hr: newEmployee.hr ? newEmployee.hr : '',
        designation: newEmployee.designation ? newEmployee.designation : '',
        joiningDate: newEmployee.joiningDate ? newEmployee.joiningDate : '',
        salary: newEmployee.salary ? newEmployee.salary : 0,
        workType: newEmployee.workType ? newEmployee.workType : '',
        profileImage: newEmployee ? newEmployee.profileImage : '',
      };
      debugger;
      console.log('New employee data:', paylaod);

      const ENDPOINT = this.data.editData
        ? API_ENDPOINTS.SERVICE_UPDATE_EMPLOYEE_LIST
        : API_ENDPOINTS.SERVICE_SAVE_NEW_USER;

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
    } else {
      this.employeeForm.markAllAsTouched();
    }
  }

  onSelectFile(event: Event): void {
      const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file || !file.type.startsWith('image/')) {
    this.commonService.openSnackbar('Only image files are allowed', 'error');
    return;
  }

  if (file.size > 2 * 1024 * 1024) { // 2 MB limit
    this.commonService.openSnackbar('Image must be less than 2MB', 'error');
    return;
  }

  // // Instant preview (optional, UX-friendly)
  // const reader = new FileReader();
  // reader.onload = () => {
  //   this.previewUrl = reader.result; // show preview immediately
  // };
  // reader.readAsDataURL(file);

  // Upload to backend (Filebase)
  const formData = new FormData();
  formData.append('file', file);

  this.apiService.postFormDataApi(API_ENDPOINTS.SERVICE_UPLOADFILE, formData).subscribe({
    next: (res) => {
      const uploadedUrl = res?.data?.presignFileUrl;
      this.previewUrl = uploadedUrl;
      const fileKey = res?.data?.fileKey
      this.employeeForm.patchValue({ profileImage: fileKey });
      this.commonService.openSnackbar(res.message, 'success');
    },
    error: (error) => {
      console.error('Upload error:', error);
      this.commonService.openSnackbar(error.error.message, 'error');
    }
  });
    
  }

  cancel() {
    this.dialogRef.close();
  }
}
