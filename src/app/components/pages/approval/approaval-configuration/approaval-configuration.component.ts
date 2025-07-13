import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { SHARED_MATERIAL_MODULES } from '../../../../shared/common/shared-material';
import { CommonService } from '../../../../shared/service/common/common.service';
import { ApiService } from '../../../../shared/service/api/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { API_ENDPOINTS } from '../../../../shared/common/api-contant';
import { CryptoService } from '../../../../shared/service/common/crypto.service';

@Component({
  selector: 'app-approaval-configuration',
  standalone: true,
  imports: [SHARED_MATERIAL_MODULES],
  templateUrl: './approaval-configuration.component.html',
  styleUrl: './approaval-configuration.component.scss',
})
export class ApproavalConfigurationComponent {
  private destroy$ = new Subject<void>();

  approvalconfigFilterForm!: FormGroup;

  displayedColumns: string[] = ['srno', 'typeName', 'action'];

  dataSource: Array<any> = [];
  requestTypeList: Array<any> = [];

  totalRecords = 0;
  pageSize = 5;
  currentPage: number = 1;

  constructor(
    private commonService: CommonService,
    private apiService: ApiService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private cryptoService: CryptoService
  ) {}

  ngOnInit(): void {
    this.prepareApprovalConfigFilterForm();
    this.getparams();
    this.applyFilters();
  }

  prepareApprovalConfigFilterForm() {
    this.approvalconfigFilterForm = new FormGroup({
      request: new FormControl(''),
    });
  }

  getparams() {
    this.activateRoute.data
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        console.log('PARAMS--->', params);

        if (params['data']) {
          debugger;
          this.requestTypeList = params['data']?.requestType?.data?.types || [];
          this.requestTypeList = this.requestTypeList.map((requestType) => {
            return {
              value: requestType.typeValue,
              label: requestType.typeLabel,
            };
          });
          console.log(this.requestTypeList);
        }
      });
  }

  applyFilters() {
    const { request } = this.approvalconfigFilterForm.getRawValue();

    const paylaod = {
      typeName: request ? request : '',
    };

    this.apiService
      .postApiCall(
        API_ENDPOINTS.SERVICE_GET_ALL_APPROVAL_CONFIGURATION_DETAILS,
        paylaod
      )
      .subscribe((res) => {
        console.log(res);

        this.dataSource = res?.data?.approvals || [];
      });
  }

  clearFilters() {
    this.approvalconfigFilterForm.reset();
  }

  createApprovalConfiguration() {
    this.router.navigateByUrl('/create-approval-configuration');
  }

  editRequestType(element: any) {
    const payload = {
      data: element,
      mode: 'edit',
    };
    this.router.navigate(['/create-approval-configuration'], {
      queryParams: {
        data: this.cryptoService.encrypt(payload),
      },
    });
  }

  deleteRequestType(element: any) {
    const paylaod = {
      id: element ? element._id : '',
    };

    this.apiService
      .postApiCall(
        API_ENDPOINTS.SERVICE_DELETE_APPROVAL_CONFIGURATION_DETAILS,
        paylaod
      )
      .subscribe((res) => {
        console.log(res);
        this.applyFilters();
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
