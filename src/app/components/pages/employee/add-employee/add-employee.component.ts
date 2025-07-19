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
  genderTypeList: Array<any> = [];
  departmentTypeList: Array<any> = [];
  reportedByTypeList: Array<any> = [];

  isEditMode: Boolean = false;

  previewUrl: string | ArrayBuffer | null = null;
  defaultAvatar =
    'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png';
  selectedFile: File | null = null;
  fileName: any;
  fileKey: any;

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

    this.genderTypeList = this.data.genderType || [];

    console.log('Gender', this.genderTypeList);

    this.departmentTypeList = this.data.departmentType || [];

    console.log('Department', this.departmentTypeList);

    this.reportedByTypeList = this.data.reportedEmployee || [];

    console.log('Reported Employeee', this.reportedByTypeList);
  }

  prepareAddEmployeeForm() {
    this.employeeForm = this.fb.group({
      profileImage: [''],
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(REGEX.EMAIL_REGEX)]],
      mobile: [
        '',
        [Validators.required, Validators.pattern(REGEX.MOBILE_NUMBER_REGEX)],
      ],
      address: ['', Validators.required],
      status: ['', Validators.required],
      type: [''],
      reportedBy: [''],
      department: [''],
      role: [''],
      designation: [''],
      joiningDate: [''],
      salary: [0],
      workType: [''],
    });
    // debugger
    if (this.data.editData) {
      this.isEditMode = true;
      // debugger
      this.employeeForm.patchValue({
        firstName: this.data.editData.firstName,
        middleName: this.data.editData.middleName,
        lastName: this.data.editData.lastName,
        dob: this.data.editData.dob,
        gender: this.data.editData.gender,
        email: this.data.editData.email,
        mobile: this.data.editData.mobile,
        address: this.data.editData.address,
        status: this.data.editData.status,
        type: this.data.editData.type,
        reportedBy: this.data.editData.reportedBy,
        role: this.data.editData.role,
        designation: this.data.editData.designation,
        department: this.data.editData.department,
        joiningDate: this.data.editData.joiningDate,
        salary: this.data.editData.salary,
        workType: this.data.editData.workType,
        // profileImage: this.data.editData.profileImage
      });
      console.log(this.data.editData.profileImage);
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
        firstName: newEmployee.firstName ? newEmployee.firstName : '',
        middleName: newEmployee.middleName ? newEmployee.middleName : '',
        lastName: newEmployee.lastName ? newEmployee.lastName : '',
        email: newEmployee.email ? newEmployee.email : '',
        dob: newEmployee.dob ? newEmployee.dob : '',
        gender: newEmployee.gender ? newEmployee.gender : '',
        mobile: newEmployee.mobile ? newEmployee.mobile : '',
        address: newEmployee.address ? newEmployee.address : '',
        role: newEmployee.role ? newEmployee.role : '',
        status: newEmployee.status ? newEmployee.status : '',
        type: newEmployee.type ? newEmployee.type : '',
        reportedBy: newEmployee.reportedBy ? newEmployee.reportedBy : '',
        designation: newEmployee.designation ? newEmployee.designation : '',
        department: newEmployee.department ? newEmployee.department : '',
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

    if (!input.files || input.files.length === 0) {
      this.commonService.openSnackbar('No file selected.', 'error');
      return;
    }

    const file = input.files[0];
    const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    if (!allowedFileTypes.includes(file.type)) {
      this.commonService.openSnackbar(
        'Only JPG, JPEG, and PNG, pdf files are allowed.',
        'error'
      );
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    this.apiService
      .postFormDataApi(API_ENDPOINTS.SERVICE_UPLOADFILE, formData)
      .subscribe({
        next: (res) => {
          const uploadedUrl = res?.data?.presignFileUrl;
          
          this.previewUrl = uploadedUrl;
          console.log(this.previewUrl);
          this.fileKey = res?.data?.fileKey;
          this.employeeForm.patchValue({ profileImage: this.fileKey });
          this.commonService.openSnackbar(res.message, 'success');
        },
        error: (error) => {
          console.error('Upload error:', error);
          this.commonService.openSnackbar(error.error.message, 'error');
        },
      });
  }

  onViewDocument(filename?: string, filepath?: any) {
    if (filepath !== '' || this.previewUrl) {
      const filename = this.fileKey;
      const filepath = this.previewUrl;

      if (filepath) {
        this.commonService.onViewDocument(filename, filepath);
      } else {
        this.commonService.openSnackbar(
          'No image available to preview',
          'error'
        );
      }
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
