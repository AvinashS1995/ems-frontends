import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { SHARED_MATERIAL_MODULES } from '../../../../shared/common/shared-material';
import { ApiService } from '../../../../shared/service/api/api.service';
import { CommonService } from '../../../../shared/service/common/common.service';
import { API_ENDPOINTS } from '../../../../shared/common/api-contant';
import { REGEX } from '../../../../shared/common/constant';
import { Subject, takeUntil } from 'rxjs';

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
  selector: 'app-employee-profile',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './employee-profile.component.html',
  styleUrl: './employee-profile.component.scss',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class EmployeeProfileComponent {
  private destroy$ = new Subject<void>();
  updateEmployeeProfileForm!: FormGroup;

  roleList: Array<any> = [];
  statusList: Array<any> = [];
  experienceTypeList: Array<any> = [];
  designationList: Array<any> = [];
  workTypeList: Array<any> = [];
  genderTypeList: Array<any> = [];
  departmentTypeList: Array<any> = [];
  reportedByEmployeeList: Array<any> = [];
  countryList = [{ label: 'India' }, { label: 'USA' }, { label: 'Germany' }];

  uploadedPhotoUrl: string = '';
  isFormChanged = false;
  initialFormValue: any;
  previewUrl: string | ArrayBuffer | null = null;
  defaultAvatar: any;

  constructor(
    private fb: FormBuilder,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.prepareUpdateEmployeeProfileForm();
    this.getparam();
    const currentUser = this.commonService.getCurrentUserDetails();
    this.defaultAvatar =
      currentUser.gender === 'Female'
        ? 'https://cdn-icons-png.flaticon.com/512/6997/6997668.png'
        : 'https://www.w3schools.com/howto/img_avatar.png';
  }

  prepareUpdateEmployeeProfileForm() {
    this.updateEmployeeProfileForm = this.fb.group({
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
      country: [''],
      status: ['', Validators.required],
      type: [''],
      empno: [''],
      department: [''],
      reportedBy: [''],
      role: [''],
      designation: [''],
      joiningDate: [''],
      salary: [0],
      workType: [''],
    });

    const {
      firstName,
      middleName,
      lastName,
      dob,
      gender,
      email,
      mobile,
      address,
      country,
      status,
      empNo,
      type,
      reportedBy,
      role,
      designation,
      department,
      joiningDate,
      salary,
      workType,
      profileImage,
    } = this.commonService.getCurrentUserDetails();

    this.updateEmployeeProfileForm.patchValue({
      firstName: firstName || '',
      middleName: middleName || '',
      lastName: lastName || '',
      dob: dob || '',
      gender: gender || '',
      email: email || '',
      mobile: mobile || '',
      address: address || '',
      country: country || '',
      status: status || '',
      type: type || '',
      empno: empNo || '',
      reportedBy: reportedBy || '',
      role: role || '',
      designation: designation || '',
      department: department || '',
      joiningDate: joiningDate || '',
      salary: salary || '',
      workType: workType || '',
    });

    this.uploadedPhotoUrl = profileImage;
    this.updateEmployeeProfileForm.patchValue({
      profileImage: this.uploadedPhotoUrl,
    });

    this.setSubscription();
  }

  getparam() {
    this.activateRoute.data.subscribe((params) => {
      console.log('Title ---->', params);

      if (params['data']) {
        this.roleList = params['data'].roles?.data?.types || [];
        this.roleList = this.roleList.map((item) => {
          return {
            value: item.typeValue,
            label: item.typeLabel,
          };
        });

        console.log('Roles--->', this.roleList);

        this.statusList = params['data'].status?.data?.types || [];
        this.statusList = this.statusList.map((status) => {
          return {
            value: status.typeValue,
            label: status.typeLabel,
          };
        });

        console.log('Status ---->', this.statusList);

        this.designationList = params['data'].designations?.data?.types || [];
        this.designationList = this.designationList.map((description) => {
          return {
            value: description.typeValue,
            label: description.typeLabel,
          };
        });

        this.experienceTypeList =
          params['data'].experienceLevel?.data?.types || [];
        this.experienceTypeList = this.experienceTypeList.map(
          (experienceLevel) => {
            return {
              value: experienceLevel.typeValue,
              label: experienceLevel.typeLabel,
            };
          }
        );

        this.workTypeList = params['data'].workType?.data?.types || [];
        this.workTypeList = this.workTypeList.map((workType) => {
          return {
            value: workType.typeValue,
            label: workType.typeLabel,
          };
        });

        this.genderTypeList = params['data'].genderType?.data?.types || [];
        this.genderTypeList = this.genderTypeList.map((genderType) => {
          return {
            value: genderType.typeValue,
            label: genderType.typeLabel,
          };
        });

        this.departmentTypeList =
          params['data'].departmentType?.data?.types || [];
        this.departmentTypeList = this.departmentTypeList.map(
          (departmentType) => {
            return {
              value: departmentType.typeValue,
              label: departmentType.typeLabel,
            };
          }
        );

        this.reportedByEmployeeList =
          params['data'].getAllEmployee?.data?.userList || [];
        this.reportedByEmployeeList = this.reportedByEmployeeList.map(
          (allEmployee) => {
            return {
              label: `${allEmployee.firstName} ${allEmployee.lastName} - [${allEmployee.empNo}]`,
              value: allEmployee.empNo,
            };
          }
        );
      }
    });
  }

  setSubscription() {
    this.initialFormValue = this.updateEmployeeProfileForm.getRawValue();

    this.updateEmployeeProfileForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((currentValue) => {
        this.isFormChanged =
          JSON.stringify(currentValue) !==
          JSON.stringify(this.initialFormValue);
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file || !file.type.startsWith('image/')) {
      this.commonService.openSnackbar('Only image files are allowed', 'error');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.commonService.openSnackbar('Image must be less than 2MB', 'error');
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
          const fileKey = res?.data?.fileKey;

          this.updateEmployeeProfileForm.patchValue({
            profileImage: uploadedUrl,
          });
          this.commonService.openSnackbar(res.message, 'success');
        },
        error: (error) => {
          console.error('Upload error:', error);
          this.commonService.openSnackbar(error.error.message, 'error');
        },
      });
  }

  onSubmitEmployeeProfileForm() {
    console.log(this.updateEmployeeProfileForm.getRawValue());

    const { _id } = this.commonService.getCurrentUserDetails();

    const newEmployee = this.updateEmployeeProfileForm.getRawValue();

    const paylaod = {
      id: _id ? _id : '',
      firstName: newEmployee.firstName ? newEmployee.firstName : '',
      middleName: newEmployee.middleName ? newEmployee.middleName : '',
      lastName: newEmployee.lastName ? newEmployee.lastName : '',
      dob: newEmployee.dob ? newEmployee.dob : '',
      gender: newEmployee.gender ? newEmployee.gender : '',
      email: newEmployee.email ? newEmployee.email : '',
      mobile: newEmployee.mobile ? newEmployee.mobile : '',
      address: newEmployee.address ? newEmployee.address : '',
      country: newEmployee.country ? newEmployee.country : '',
      role: newEmployee.role ? newEmployee.role : '',
      status: newEmployee.status ? newEmployee.status : '',
      type: newEmployee.type ? newEmployee.type : '',
      reportedBy: newEmployee.reportedBy ? newEmployee.reportedBy : '',
      department: newEmployee.department ? newEmployee.department : '',
      designation: newEmployee.designation ? newEmployee.designation : '',
      joiningDate: newEmployee.joiningDate ? newEmployee.joiningDate : '',
      salary: newEmployee.salary ? newEmployee.salary : 0,
      workType: newEmployee.workType ? newEmployee.workType : '',
      profileImage: newEmployee.profileImage
        ? newEmployee.profileImage.split('?')[0].split('/').pop()
        : '',
    };

    console.log('Update employee data:', paylaod);

    this.apiService
      .postApiCall(API_ENDPOINTS.SERVICE_UPDATE_EMPLOYEE_LIST, paylaod)
      .subscribe({
        next: (res: any) => {
          console.log(
            `${API_ENDPOINTS.SERVICE_UPDATE_EMPLOYEE_LIST} Response : `,
            res
          );
          this.isFormChanged = false;
          this.commonService.openSnackbar(res.message, 'success');
        },
        error: (error) => {
          this.commonService.openSnackbar(error.error.message, 'error');
        },
      });
  }

  cancelForm() {
    this.router.navigateByUrl('/dashboard');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
