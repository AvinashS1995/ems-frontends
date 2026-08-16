import { Injectable } from '@angular/core';
import { ApiService } from '../../../shared/service/api/api.service';
import { forkJoin, Observable, of } from 'rxjs';
import { API_ENDPOINTS } from '../../../shared/common/api-contant';
import { CommonService } from '../../../shared/service/common/common.service';

@Injectable({
  providedIn: 'root',
})
export class PayrollManagementResolverService {
  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
  ) {}

  resolve(): Observable<any> {
    let getAllEmployee = of({});
    const payload = {
      empNo: this.commonService.getCurrentUserDetails()?.empNo || '',
    };
    getAllEmployee = this.apiService.postApiCall(
      API_ENDPOINTS.SERVICE_GET_USER_LIST,
      payload,
    );

    return forkJoin({
      getAllEmployee,
    });
  }
}
