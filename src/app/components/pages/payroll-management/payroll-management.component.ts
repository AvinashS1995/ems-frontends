import { Component } from '@angular/core';
import { API_ENDPOINTS } from '../../../shared/common/api-contant';
import { PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonService } from '../../../shared/service/common/common.service';
import { ApiService } from '../../../shared/service/api/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_MATERIAL_MODULES } from '../../../shared/common/shared-material';
import { MONTH_LIST, YEAR_LIST } from '../../../shared/common/constant';

@Component({
  selector: 'app-payroll-management',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './payroll-management.component.html',
  styleUrl: './payroll-management.component.scss',
})
export class PayrollManagementComponent {
  employeePayrollFilterForm!: FormGroup;

  monthList = MONTH_LIST;
  yearList = YEAR_LIST;
  allEmployeeList: Array<any> = [];

  employeeMonthlyPayrollList: Array<any> = [];

  totalRecords = 0;
  pageSize = 10;
  currentPage: number = 1;

  displayedColumns: string[] = [
    'srNo',
    'name',
    'designation',
    'department',
    'emailedAt',
    'bankName',
    'bankAccount',
    'pan',
    'pfNo',
    'netPay',
  ];

  constructor(
    private commonService: CommonService,
    private apiService: ApiService,
    private fb: FormBuilder,
    private activateRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.prepareMenuFilterForm();
    this.getparams();
    this.applyFilters();
  }

  prepareMenuFilterForm() {
    const today = new Date();
    this.employeePayrollFilterForm = this.fb.group({
      month: [today.getMonth() + 1],
      year: [today.getFullYear()],
      empNo: [''],
    });
  }

  getparams() {
    this.activateRoute.data.subscribe((params) => {
      console.log('Title ---->', params);

      if (params['data']) {
        this.allEmployeeList =
          params['data'].getAllEmployee?.data?.userList || [];
        this.allEmployeeList = this.allEmployeeList.map((attendeesEmployee) => {
          return {
            label: `${attendeesEmployee.firstName} ${attendeesEmployee.lastName} - [${attendeesEmployee.empNo}]`,
            value: attendeesEmployee.empNo,
          };
        });

        console.log('Roles--->', this.allEmployeeList);
      }
    });
  }

  applyFilters() {
    const { month, year, empNo } = this.employeePayrollFilterForm.getRawValue();

    const isEmployeeRole =
      this.commonService.getCurrentUserDetails().role !== 'HR';
    const employee = isEmployeeRole
      ? this.commonService.getCurrentUserDetails().empNo
      : empNo;

    const payload = {
      month: month || 0,
      year: year || 0,
      employeeId: employee || '',
      page: this.currentPage || 1,
      limit: this.pageSize || 10,
    };

    this.apiService
      .postApiCall(
        API_ENDPOINTS.SERVICE_GET_ALL_EMPLOYYEE_MONTHLY_PAYSLIP,
        payload
      )
      .subscribe({
        next: (res: any) => {
          console.log(
            `${API_ENDPOINTS.SERVICE_GET_ALL_EMPLOYYEE_MONTHLY_PAYSLIP} Response : `,
            res
          );

          this.employeeMonthlyPayrollList = res.data.formattedPayslips || [];
          this.totalRecords = res.totalRecords || 0;

          this.commonService.openSnackbar(res.message, 'success');
        },
        error: (error) => {
          this.commonService.openSnackbar(error.error.message, 'error');
        },
      });
  }

  clearFilters() {
    this.employeePayrollFilterForm.reset();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.applyFilters();
  }

  openPayslip(fileUrl: string, filename?: string) {
    debugger;
    if (filename !== '' && fileUrl) {
      const url = fileUrl;
      if (fileUrl) {
        this.commonService.onViewDocument(filename, url);
      } else {
        this.commonService.openSnackbar('No Pdf available to preview', 'error');
      }
    }
  }
}
