import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { ApiService } from '../../../shared/service/api/api.service';
import { CommonService } from '../../../shared/service/common/common.service';
import { API_ENDPOINTS } from '../../../shared/common/api-contant';

@Injectable({
  providedIn: 'root'
})
export class DashboardResolverService {

  constructor(private apiService: ApiService, private commonService: CommonService) {}

  

  resolve(): Observable<any> {

    let getUpcomingHoliday = of({});
    // let getEmployeeRequestList = of({});
    
    getUpcomingHoliday = this.apiService.getApiCall(API_ENDPOINTS.SERVICE_GET_UPCOMING_HOLIDAYS);

    // const payload = {
    //   empNo : this.commonService.userDetails.empNo || '',
    //   role : this.commonService.userDetails.role || '',
    // }
    // getEmployeeRequestList = this.apiService.postApiCall(API_ENDPOINTS.SERVICE_GET_EMPLOYEE_LEAVE_REQUEST_LIST, payload);


   return forkJoin({
    getUpcomingHoliday,
    // getEmployeeRequestList
    });
  }
}
