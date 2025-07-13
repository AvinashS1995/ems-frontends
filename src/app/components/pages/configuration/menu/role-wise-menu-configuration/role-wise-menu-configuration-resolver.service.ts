import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { ApiService } from '../../../../../shared/service/api/api.service';
import { API_ENDPOINTS } from '../../../../../shared/common/api-contant';

@Injectable({
  providedIn: 'root',
})
export class RoleWiseMenuConfigurationResolverService {
  constructor(private apiService: ApiService) {}

  resolve(): Observable<any> {
    let roles = of({});

    roles = this.apiService.postApiCall(API_ENDPOINTS.SERVICE_GETROLETYPE, {
      entityValue: 'Role',
    });

    return forkJoin({
      roles,
    });
  }
}
