import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { CommonService } from '../../../../../shared/service/common/common.service';
import { CryptoService } from '../../../../../shared/service/common/crypto.service';
import { ApiService } from '../../../../../shared/service/api/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SHARED_MATERIAL_MODULES } from '../../../../../shared/common/shared-material';
import { API_ENDPOINTS } from '../../../../../shared/common/api-contant';

@Component({
  selector: 'app-popup-configuration',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './popup-configuration.component.html',
  styleUrl: './popup-configuration.component.scss',
})
export class PopupConfigurationComponent {
  popupConfigFilterForm!: FormGroup;

  menuStatusList: Array<any> = [];

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
  }

  prepareMenuFilterForm() {
    this.popupConfigFilterForm = this.fb.group({
      menuName: [''],
      menuStatus: [''],
    });
  }

  createMenu() {
    this.router.navigateByUrl('/create-popup-configuration');
  }

  applyFilters() {
    this.apiService
      .postApiCall(API_ENDPOINTS.SERVICE_GET_ALL_POPUP_DETAILS, {})
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
    // this.getEmployeesLeave();
  }

  onEdit(element: any): void {
    console.log('Edit:', element);
    const payload = {
      ...element,
      mode: 'edit',
    }
    this.router.navigate(['/create-popup-configuration'], {
      queryParams: {
        data: this.cryptoService.encrypt(payload),
      },
    });
  }

  onDelete(element: any): void {
    console.log('Delete:', element);
    // Show confirmation and call delete API
  }
}
