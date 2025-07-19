import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../../../../shared/common/api-contant';
import { ApiService } from '../../../../shared/service/api/api.service';
import { forkJoin, Observable, of } from 'rxjs';
import { ActivatedRouteSnapshot } from '@angular/router';
import { CryptoService } from '../../../../shared/service/common/crypto.service';

@Injectable({
  providedIn: 'root',
})
export class ApprovalConfigurationResolverService {
  constructor(
    private apiService: ApiService,
    private cryptoService: CryptoService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    let requestType = of({});
    let roles = of({});
    let approvalDetails = of({});

    requestType = this.apiService.postApiCall(
      API_ENDPOINTS.SERVICE_GETROLETYPE,
      { entityValue: 'RequestType' }
    );
    roles = this.apiService.postApiCall(API_ENDPOINTS.SERVICE_GETROLETYPE, {
      entityValue: 'Role',
    });
    
    if (route.queryParams['data']) {
      const decrypted = this.cryptoService.decrypt(route.queryParams['data']);
      approvalDetails = of(decrypted as any);
    }

    return forkJoin({
      requestType,
      roles,
      approvalDetails,
    });
  }
}
