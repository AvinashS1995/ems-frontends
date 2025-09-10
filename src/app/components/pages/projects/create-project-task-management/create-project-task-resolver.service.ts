import { Injectable } from '@angular/core';
import { ApiService } from '../../../../shared/service/api/api.service';
import { API_ENDPOINTS } from '../../../../shared/common/api-contant';
import { forkJoin, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CreateProjectTaskResolverService {
  constructor(private apiService: ApiService) {}

  resolve(): Observable<any> {
    let getprojects = of({});

    getprojects = this.apiService.postApiCall(
      API_ENDPOINTS.SERVICE_GET_PROJETS,
      {}
    );

    return forkJoin({
      getprojects,
    });
  }
}
