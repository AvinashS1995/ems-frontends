import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoaderService } from './loader.service';
import { finalize, map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private baseUrl = 'http://localhost:3000/api/' ;
  // private baseUrl = 'https://ems-backend-api.onrender.com/api/';
  // private baseUrl = environment.apiUrl; // Live 

  constructor(
    private http: HttpClient,
    private loader: LoaderService
  ) {}

  get<T>(endpoint: string, options?: any): Observable<T> {
    if (options?.showLoader !== false) {
      this.loader.show();
    }

    return this.http.get(this.baseUrl + endpoint, options).pipe(
      map((event: any) => event as T),
      finalize(() => {
        if (options?.showLoader !== false) {
          this.loader.hide();
        }
        // if (options?.showSnackBar) {
        //   this.snackBar.open('GET request successful', 'Close', { duration: 2000 });
        // }
      })
    );
  }

  post<T>(endpoint: string, body: any, options?: any): Observable<T> {
    if (options?.showLoader !== false) {
      this.loader.show();
    }

    return this.http.post(this.baseUrl + endpoint, body, options).pipe(
      map((event: any) => event as T),
      finalize(() => {
        if (options?.showLoader !== false) {
          this.loader.hide();
        }
        // if (options?.showSnackBar) {
        //   this.snackBar.open('POST request successful', 'Close', { duration: 2000 });
        // }
      })
    );
  }

  put<T>(endpoint: string, body: any, options?: any): Observable<T> {
    if (options?.showLoader !== false) {
      this.loader.show();
    }

    return this.http.put(this.baseUrl + endpoint, body, options).pipe(
      map((event: any) => event as T),
      finalize(() => {
        if (options?.showLoader !== false) {
          this.loader.hide();
        }
        // if (options?.showSnackBar) {
        //   this.snackBar.open('PUT request successful', 'Close', { duration: 2000 });
        // }
      })
    );
  }
}
