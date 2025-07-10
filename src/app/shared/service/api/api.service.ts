import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  
  constructor(private http: HttpService) {}

  authApiCall(endPoint: string, request: any) {
    return this.http.post(`${endPoint}`, request);
  }

  menuApiCall(endPoint: string, request: any) {
    return this.http.post(`${endPoint}`, request);
  }

  getApiCall(endPoint: string) {
    return this.http.get<any>(`${endPoint}`);
  }

  postApiCall(endPoint: string, request: any) {
    return this.http.post<any>(`${endPoint}`, request);
  }

  postFormDataApi(url: string, formData: FormData): Observable<any> {
  return this.http.post(url, formData); 
}
}
