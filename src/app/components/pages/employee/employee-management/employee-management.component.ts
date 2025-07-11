import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import { ActivatedRoute, Data, Router } from '@angular/router';
const moment = _moment;
import { MatDialog } from '@angular/material/dialog';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SHARED_MATERIAL_MODULES } from '../../../../shared/common/shared-material';
import { ApiService } from '../../../../shared/service/api/api.service';
import { CommonService } from '../../../../shared/service/common/common.service';
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
  selector: 'app-employee-management',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './employee-management.component.html',
  styleUrl: './employee-management.component.scss',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class EmployeeManagementComponent {

  displayedColumns: string[] = [
    'empno',
    'name',
    'role',
    'designation',
    'type',
    'teamLeader',
    'joiningDate',
    'salary',
    'workType',
    'status',
    'action'
  ];
  dataSource: Array<any> = [];


  employeeFilterForm!: FormGroup;

  searchText: string = '';
  selectedRole: string = '';
  selectedDate: Date | null = null;
  roles: Array<any> = [];
  statuses: Array<any> = [];
  designationList: Array<any> = [];
  experienceTypeList: Array<any> = [];
  workTypeList: Array<any> = [];

  totalRecords = 0;
  pageSize = 5;
  currentPage: number = 1;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private activateRoute: ActivatedRoute,
    private apiService: ApiService,
    private fb: FormBuilder,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.prepareEmployeeFilterForm();
    this.getparam();
    this.getEmployees();
  }

  getparam() {
    this.activateRoute.data.subscribe((params) => {
      console.log('Title ---->', params);

      if (params['data']) {
        this.roles = params['data'].roles?.data?.types || [];
        this.roles = this.roles.map((item) => {
          return {
            value: item.typeValue,
            label: item.typeLabel,
          };
        });

        console.log('Roles--->', this.roles);

        this.statuses = params['data'].status?.data?.types || [];
        this.statuses = this.statuses.map((status) => {
          return {
            value: status.typeValue,
            label: status.typeLabel,
          };
        });

        console.log('Status ---->', this.statuses);

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

  prepareEmployeeFilterForm() {
     this.employeeFilterForm = this.fb.group({
          name: ['',],
          role: [''],
          status: [''],
          type: [''],
        });
  }
  

  addEmployee(employeeTypeData?: any) {
    // debugger
    const dialogRef = this.dialog.open(AddEmployeeComponent, {
      width: '500px',
      disableClose: true,
      data: {
        editData: employeeTypeData || null,
        Roles: this.roles,
        Status: this.statuses,
        designations: this.designationList,
        experienceLevel: this.experienceTypeList,
        workType: this.workTypeList
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'saved' || result === 'updated') {
        this.getEmployees();
      }
    });
  }

  getEmployees() {

    const { name, role, status, type} = this.employeeFilterForm.getRawValue()

    const paylaod = {
      name: name ? name : '',
      role: role ? role : '',
      status: status ? status : '',
      type: type ? type : '',
      page: this.currentPage,
      limit: this.pageSize
    }

    this.apiService.postApiCall(API_ENDPOINTS.SERVICE_GET_USER_LIST, paylaod).subscribe({
      next: (res: any) => {
        console.log(`${API_ENDPOINTS.SERVICE_SAVE_NEW_USER} Response : `, res);

        this.dataSource = res?.data?.userList || [];
        this.totalRecords = res.data.totalRecords || 0;
        
        this.commonService.openSnackbar(res.message, 'success');
      },
      error: (error) => {
        this.commonService.openSnackbar(error.error.message, 'error');
      },
    });
  }


  clearFilters() {
   this.employeeFilterForm.reset();
  }

  applyFilters() {
    this.getEmployees();
  }

  editEmployee(employee: any) {
    // debugger
    this.addEmployee(employee)
  }

  deleteEmployee(employee: any) {

    const paylaod = {
      id: employee ? employee._id : 0,
    };

    console.log(paylaod);

    this.apiService
      .postApiCall(API_ENDPOINTS.SERVICE_DELETE_EMPLOYEE_LIST, paylaod)
      .subscribe({
        next: (res: any) => {
          console.log(
            `${API_ENDPOINTS.SERVICE_DELETE_EMPLOYEE_LIST} Response : `,
            res
          );
          this.getEmployees();

          this.commonService.openSnackbar(res.message, 'success');
        },
        error: (error) => {
          this.commonService.openSnackbar(error.error.message, 'error');
        },
      });
    console.log('Delete clicked:', employee);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getEmployees();
  }

  
}
