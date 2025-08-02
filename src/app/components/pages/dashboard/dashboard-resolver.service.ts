import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { ApiService } from '../../../shared/service/api/api.service';
import { CommonService } from '../../../shared/service/common/common.service';
import { API_ENDPOINTS } from '../../../shared/common/api-contant';

@Injectable({
  providedIn: 'root',
})
export class DashboardResolverService {
  constructor(
    private apiService: ApiService,
    private commonService: CommonService
  ) {}

  resolve(): Observable<any> {
    let getUpcomingHoliday = of({});
    let getEmployeeMeetingList = of({});
    let todayAttendenceSummary = of({});

    getUpcomingHoliday = this.apiService.getApiCall(
      API_ENDPOINTS.SERVICE_GET_UPCOMING_HOLIDAYS
    );

    // const payload = {
    //   empNo : this.commonService.userDetails.empNo || '',
    //   role : this.commonService.userDetails.role || '',
    // }
    getEmployeeMeetingList = this.apiService.postApiCall(
      API_ENDPOINTS.SERVICE_GET_ALL_MEETING_SCHEDULE,
      { empNo: this.commonService.getCurrentUserDetails().empNo || '' }
    );

    todayAttendenceSummary = this.apiService.getApiCall(
      API_ENDPOINTS.SERVICE_GET_USER_ATTENDENCE_TODAY_SUMMARY
    );

    return forkJoin({
      getUpcomingHoliday,
      getEmployeeMeetingList,
      todayAttendenceSummary,
    });
  }
}
