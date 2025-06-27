import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';

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
}
