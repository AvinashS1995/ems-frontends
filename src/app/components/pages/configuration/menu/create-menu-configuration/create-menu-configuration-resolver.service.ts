import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { ActivatedRouteSnapshot } from '@angular/router';
import { CommonService } from '../../../../../shared/service/common/common.service';
import { ApiService } from '../../../../../shared/service/api/api.service';
import { API_ENDPOINTS } from '../../../../../shared/common/api-contant';
import { CryptoService } from '../../../../../shared/service/common/crypto.service';

@Injectable({
  providedIn: 'root'
})
export class CreateMenuConfigurationResolverService {

  constructor(private apiService: ApiService, private commonService: CommonService, private cryptoService: CryptoService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {

    let menus = of({});
    let menuDetails = of({});
    let menuStatus = of({})


    if(route.queryParams['data']) {
      const decrypted = this.cryptoService.decrypt(route.queryParams['data']);
      menuDetails = of(decrypted as any)
    }
    const paylaod = {
      role: this.commonService.getCurrentUserDetails().role || ''
    }
    menus = this.apiService.postApiCall(API_ENDPOINTS.SERVICE_GETMENUS, paylaod);
    
    menuStatus = this.apiService.postApiCall(API_ENDPOINTS.SERVICE_GETROLETYPE, { entityValue: "EmployeeStatus" });



   return forkJoin({
    menus,
    menuDetails,
    menuStatus

    });
  }
}
