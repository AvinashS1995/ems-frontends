import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { ApiService } from '../../../../../shared/service/api/api.service';
import { API_ENDPOINTS } from '../../../../../shared/common/api-contant';

@Injectable({
  providedIn: 'root'
})
export class MenuConfigurationResolverService {

  constructor(private apiService: ApiService) {}

  
  resolve(): Observable<any> {

    let menuStatus = of({})
    
    menuStatus = this.apiService.postApiCall(API_ENDPOINTS.SERVICE_GETROLETYPE, { entityValue: "EmployeeStatus" });


   return forkJoin({
    menuStatus,
    });
  }
}
