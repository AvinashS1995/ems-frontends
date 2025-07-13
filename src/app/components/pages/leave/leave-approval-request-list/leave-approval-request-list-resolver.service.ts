import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { API_ENDPOINTS } from '../../../../shared/common/api-contant';
import { ApiService } from '../../../../shared/service/api/api.service';

@Injectable({
  providedIn: 'root',
})
export class LeaveApprovalRequestListResolverService {
  constructor(private apiService: ApiService) {}

  resolve(): Observable<any> {
    let leaveType = of({});
    let leaveReasonType = of({});

    leaveType = this.apiService.postApiCall(API_ENDPOINTS.SERVICE_GETROLETYPE, {
      entityValue: 'leaveType',
    });
    leaveReasonType = this.apiService.postApiCall(
      API_ENDPOINTS.SERVICE_GETROLETYPE,
      { entityValue: 'leaveReasonType' }
    );

    return forkJoin({
      leaveType,
      leaveReasonType,
    });
  }
}
