import { Injectable } from '@angular/core';
import { ApiService } from '../../../shared/service/api/api.service';
import { forkJoin, Observable, of } from 'rxjs';
import { API_ENDPOINTS } from '../../../shared/common/api-contant';

@Injectable({
  providedIn: 'root',
})
export class PayrollManagementResolverService {
  constructor(private apiService: ApiService) {}

  resolve(): Observable<any> {
    let getAllEmployee = of({});

    getAllEmployee = this.apiService.postApiCall(
      API_ENDPOINTS.SERVICE_GET_USER_LIST,
      {}
    );

    return forkJoin({
      getAllEmployee,
    });
  }
}
