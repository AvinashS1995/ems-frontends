import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { SHARED_MATERIAL_MODULES } from '../../../../shared/common/shared-material';
import { ApiService } from '../../../../shared/service/api/api.service';
import { CommonService } from '../../../../shared/service/common/common.service';
import { API_ENDPOINTS } from '../../../../shared/common/api-contant';
import { REGEX } from '../../../../shared/common/constant';

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
  updateEmployeeProfileForm!: FormGroup;

  roleList: Array<any> = [];
  statusList: Array<any> = [];
  experienceTypeList: Array<any> = [];
  designationList: Array<any> = [];
  workTypeList: Array<any> = [];

  uploadedPhotoUrl: string = '';

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
  }

  prepareUpdateEmployeeProfileForm() {
    this.updateEmployeeProfileForm = this.fb.group({
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

    const { name, email, mobile, status, type, teamLeader, manager, hr, 
      role, designation, joiningDate, salary, workType } = this.commonService.getCurrentUserDetails()

      this.updateEmployeeProfileForm.patchValue({
        name: name || '',
        email: email || '',
        mobile: mobile || '',
        status: status || '',
        type: type || '',
        teamLeader: teamLeader || '',
        manager: manager || '',
        hr: hr || '',
        role: role || '',
        designation: designation || '',
        joiningDate: joiningDate || '',
        salary: salary || '',
        workType: workType || '',
      })
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

        this.experienceTypeList = params['data'].experienceLevel?.data?.types || [];
        this.experienceTypeList = this.experienceTypeList.map((experienceLevel) => {
          return {
            value: experienceLevel.typeValue,
            label: experienceLevel.typeLabel,
          };
        });

        this.workTypeList = params['data'].workType?.data?.types || [];
        this.workTypeList = this.workTypeList.map((workType) => {
          return {
            value: workType.typeValue,
            label: workType.typeLabel,
          };
        });
      }
    });
  }

  onFileSelected(event: Event): void {
  const file = (event.target as HTMLInputElement)?.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      this.uploadedPhotoUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
    console.log(this.uploadedPhotoUrl)
  }
}

  onSubmitEmployeeProfileForm() {

    console.log(this.updateEmployeeProfileForm.getRawValue())

    const { _id } = this.commonService.userDetails

    const newEmployee = this.updateEmployeeProfileForm.getRawValue();

    const paylaod = {
        id: _id ? _id  : '',
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
        profileImage: newEmployee.profileImage ? newEmployee.profileImage : '',
      };
      debugger
      console.log('Update employee data:', paylaod);

      this.apiService.postApiCall(API_ENDPOINTS.SERVICE_UPDATE_EMPLOYEE_LIST, paylaod).subscribe({
        next: (res: any) => {
          console.log(`${API_ENDPOINTS.SERVICE_UPDATE_EMPLOYEE_LIST} Response : `, res);

          this.commonService.openSnackbar(res.message, 'success');
        },
        error: (error) => {
          this.commonService.openSnackbar(error.error.message, 'error');
        },
      });

  }

  cancelForm() {

  }
}
