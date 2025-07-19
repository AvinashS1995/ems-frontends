import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { ApiService } from '../../../../shared/service/api/api.service';
import { API_ENDPOINTS } from '../../../../shared/common/api-contant';
import { CommonService } from '../../../../shared/service/common/common.service';

@Injectable({
  providedIn: 'root'
})
export class RequestListResolverService {

   constructor(
      private apiService: ApiService,
      private commonService : CommonService
    ) {}
  
    resolve(route: ActivatedRouteSnapshot): Observable<any> {
      
      let employeeApprovalList = of({});
  
      const currentUser = this.commonService.getCurrentUserDetails();

    const paylaod = {
      approverEmpNo: currentUser.empNo || '',
    };

      employeeApprovalList = this.apiService.postApiCall(API_ENDPOINTS.SERVICE_GET_EMPLOYEE_APPROVAL_REQUEST_LIST, paylaod);
      
  
      return forkJoin({
        employeeApprovalList
      });

    }
}
