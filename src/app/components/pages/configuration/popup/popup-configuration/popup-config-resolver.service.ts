import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../../../../../shared/common/api-contant';
import { forkJoin, Observable, of } from 'rxjs';
import { ApiService } from '../../../../../shared/service/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class PopupConfigResolverService {

   constructor(private apiService: ApiService) {}
  
    resolve(): Observable<any> {
  
      let roles = of({});
      let status = of({});
      
      roles = this.apiService.postApiCall(API_ENDPOINTS.SERVICE_GETROLETYPE, { entityValue: "Role" });
      status = this.apiService.postApiCall(API_ENDPOINTS.SERVICE_GETROLETYPE, { entityValue: "EmployeeStatus" });
  
  
     return forkJoin({
      roles,
      status,
      });
    }
}
