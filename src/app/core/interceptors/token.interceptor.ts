import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JwtService } from '../services';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const headersConfig: any = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const jwtSrv = inject(JwtService);
  const token = jwtSrv.getToken();
  const isApiUrl = req.url.startsWith(environment.api_url);

  if (token && isApiUrl) {
    headersConfig['Authorization'] = `Bearer ${token}`;
  }

  const request = req.clone({ setHeaders: headersConfig });
  return next(request);
};
