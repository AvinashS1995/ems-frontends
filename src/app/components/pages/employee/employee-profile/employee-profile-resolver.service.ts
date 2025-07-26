import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { ApiService } from '../../../../shared/service/api/api.service';
import { API_ENDPOINTS } from '../../../../shared/common/api-contant';

@Injectable({
  providedIn: 'root'
})
export class EmployeeProfileResolverService {

  constructor(private apiService: ApiService) {}

  

  resolve(): Observable<any> {

    let roles = of({});
    let status = of({})
    let designations = of({})
    let experienceLevel = of({})
    let workType = of({})
    let genderType = of({})
    let departmentType = of({})
    let getAllEmployee = of({})
    
    roles = this.apiService.postApiCall(API_ENDPOINTS.SERVICE_GETROLETYPE, { entityValue: "Role" });
    status = this.apiService.postApiCall(API_ENDPOINTS.SERVICE_GETROLETYPE, { entityValue: "EmployeeStatus" });
    designations = this.apiService.postApiCall(API_ENDPOINTS.SERVICE_GETROLETYPE, { entityValue: "Designation" });
    experienceLevel = this.apiService.postApiCall(API_ENDPOINTS.SERVICE_GETROLETYPE, { entityValue: "ExperienceType" });
    workType = this.apiService.postApiCall(API_ENDPOINTS.SERVICE_GETROLETYPE, { entityValue: "WorkType" });
    genderType = this.apiService.postApiCall(API_ENDPOINTS.SERVICE_GETROLETYPE, { entityValue: "genderType" });
    departmentType = this.apiService.postApiCall(API_ENDPOINTS.SERVICE_GETROLETYPE, { entityValue: "departmentType" });
    getAllEmployee = this.apiService.postApiCall(API_ENDPOINTS.SERVICE_GET_USER_LIST, {});



   return forkJoin({
    roles,
    status,
    designations,
    experienceLevel,
    workType,
    genderType,
    departmentType,
    getAllEmployee
    });
  }
}
