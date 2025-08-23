import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../../../../../shared/common/api-contant';
import { ApiService } from '../../../../../shared/service/api/api.service';
import { forkJoin, Observable, of } from 'rxjs';
import { ActivatedRouteSnapshot } from '@angular/router';
import { CryptoService } from '../../../../../shared/service/common/crypto.service';

@Injectable({
  providedIn: 'root',
})
export class CreatePopupConfigResolverService {
  constructor(
    private apiService: ApiService,
    private cryptoService: CryptoService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    let roles = of({});
    let genderType = of({});
    let getAllEmployee = of({});
    let meetingDetails = of({});

    if (route.queryParams['data']) {
      const decrypted = this.cryptoService.decrypt(route.queryParams['data']);
      meetingDetails = of(decrypted as any);
    }

    roles = this.apiService.postApiCall(API_ENDPOINTS.SERVICE_GETROLETYPE, {
      entityValue: 'Role',
    });
    genderType = this.apiService.postApiCall(
      API_ENDPOINTS.SERVICE_GETROLETYPE,
      { entityValue: 'genderType' }
    );
    getAllEmployee = this.apiService.postApiCall(
      API_ENDPOINTS.SERVICE_GET_USER_LIST,
      {}
    );

    return forkJoin({
      roles,
      genderType,
      getAllEmployee,
      meetingDetails,
    });
  }
}
