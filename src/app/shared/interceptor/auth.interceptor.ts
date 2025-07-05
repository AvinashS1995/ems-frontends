import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../service/common/storage.service';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) =>  {
  
  const storageService = inject(StorageService); 

  let token: string | null = null;

  if (typeof window !== 'undefined') {
    token = storageService.getItem<string>('token', 'session') || storageService.getItem<string>('token', 'local');
    // console.log(token);
    
  }

  if (token) {
  //  const cloned = req.clone({
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
      // headers: req.headers.set('authorization', `Bearer ${token}`)
    });
    // return next(cloned);
  }

  return next(req);

};
