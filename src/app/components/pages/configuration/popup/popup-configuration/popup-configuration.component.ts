import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { CommonService } from '../../../../../shared/service/common/common.service';
import { CryptoService } from '../../../../../shared/service/common/crypto.service';
import { ApiService } from '../../../../../shared/service/api/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SHARED_MATERIAL_MODULES } from '../../../../../shared/common/shared-material';
import { API_ENDPOINTS } from '../../../../../shared/common/api-contant';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

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
  selector: 'app-popup-configuration',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './popup-configuration.component.html',
  styleUrl: './popup-configuration.component.scss',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class PopupConfigurationComponent {
  popupConfigFilterForm!: FormGroup;

  roleTypeList: Array<any> = [];
  statusTypeList: Array<any> = [];

  popupList: Array<any> = [];

  totalRecords = 0;
  pageSize = 5;
  currentPage: number = 1;

  displayedColumns: string[] = [
    'srNo',
    'name',
    'startDate',
    'endDate',
    'time',
    'status',
    'actions',
  ];

  constructor(
    private commonService: CommonService,
    private cryptoService: CryptoService,
    private apiService: ApiService,
    private activateRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.prepareMenuFilterForm();
    this.getparam();
    this.applyFilters();
  }

  prepareMenuFilterForm() {
    this.popupConfigFilterForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      role: [''],
      popupType: [''],
      status: [''],
    });
  }

  getparam() {
    this.activateRoute.data.subscribe((params) => {
      console.log('Title ---->', params);

      if (params['data']) {
        this.roleTypeList = params['data'].roles?.data?.types || [];
        this.roleTypeList = this.roleTypeList.map((item) => {
          return {
            value: item.typeValue,
            label: item.typeLabel,
          };
        });

        console.log('Roles--->', this.roleTypeList);

        this.statusTypeList = params['data'].status?.data?.types || [];
        this.statusTypeList = this.statusTypeList.map((status) => {
          return {
            value: status.typeValue,
            label: status.typeLabel,
          };
        });

        console.log('Status ---->', this.statusTypeList);
      }
    });
  }

  createMenu() {
    this.router.navigateByUrl('/create-popup-configuration');
  }

  applyFilters() {
    const { startDate, endDate, role, popupType, status } =
      this.popupConfigFilterForm.getRawValue();

    const payload = {
      startDate: startDate || '',
      endDate: endDate || '',
      role: role || '',
      isActive: status === 'Active' ? true : status === 'Inactive' ? false : '',
      popupType: popupType || '',
    };

    this.apiService
      .postApiCall(API_ENDPOINTS.SERVICE_GET_ALL_POPUP_DETAILS, payload)
      .subscribe({
        next: (res: any) => {
          console.log(
            `${API_ENDPOINTS.SERVICE_GET_ALL_POPUP_DETAILS} Response : `,
            res
          );

          this.popupList = res.data.popupList || [];

          this.commonService.openSnackbar(res.message, 'success');
        },
        error: (error) => {
          this.commonService.openSnackbar(error.error.message, 'error');
        },
      });
  }

  clearFilters() {
    this.popupConfigFilterForm.reset();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.applyFilters();
  }

  onEdit(element: any): void {
    console.log('Edit:', element);
    const payload = {
      ...element,
      mode: 'edit',
    };
    this.router.navigate(['/create-popup-configuration'], {
      queryParams: {
        data: this.cryptoService.encrypt(payload),
      },
    });
  }

  onDelete(element: any): void {
    console.log('Delete:', element);

    const payload = {
      id: element ? element._id : '',
    };

    this.apiService
      .postApiCall(API_ENDPOINTS.SERVICE_DELETE_POPUP_DETAILS, payload)
      .subscribe({
        next: (res: any) => {
          console.log(
            `${API_ENDPOINTS.SERVICE_DELETE_POPUP_DETAILS} Response : `,
            res
          );

          this.commonService.openSnackbar(res.message, 'success');
        },
        error: (error) => {
          this.commonService.openSnackbar(error.error.message, 'error');
        },
      });
  }

  toggleStatus(element: any): void {
    const payload = { id: element._id };

    this.apiService
      .postApiCall(API_ENDPOINTS.SERVICE_TOGGLE_POPUP_STATUS, payload)
      .subscribe({
        next: (res: any) => {
          console.log(
            `${API_ENDPOINTS.SERVICE_TOGGLE_POPUP_STATUS} Response : `,
            res
          );
          this.commonService.openSnackbar(res.message, 'success');
          this.applyFilters();
        },
        error: (err) => {
          this.commonService.openSnackbar(err.error.message, 'error');
        },
      });
  }
}
