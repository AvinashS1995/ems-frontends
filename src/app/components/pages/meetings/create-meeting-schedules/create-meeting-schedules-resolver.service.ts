import { Injectable } from '@angular/core';
import { ApiService } from '../../../../shared/service/api/api.service';
import { API_ENDPOINTS } from '../../../../shared/common/api-contant';
import { forkJoin, Observable, of } from 'rxjs';
import { ActivatedRouteSnapshot } from '@angular/router';
import { CryptoService } from '../../../../shared/service/common/crypto.service';
import { CommonService } from '../../../../shared/service/common/common.service';

@Injectable({
  providedIn: 'root',
})
export class CreateMeetingSchedulesResolverService {
  constructor(
    private apiService: ApiService,
    private cryptoService: CryptoService,
    private commonService: CommonService,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    let attendeesList = of({});
    let meetingDetails = of({});

    attendeesList = this.apiService.postApiCall(
      API_ENDPOINTS.SERVICE_GET_USER_LIST,
      { empNo: this.commonService.getCurrentUserDetails()?.empNo || '' },
    );
    debugger;
    if (route.queryParams['data']) {
      const decrypted = this.cryptoService.decrypt(route.queryParams['data']);
      meetingDetails = of(decrypted as any);
    }

    return forkJoin({
      attendeesList,
      meetingDetails,
    });
  }
}
