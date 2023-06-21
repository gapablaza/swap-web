import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { AuthService } from '../services';
import { UIService } from 'src/app/shared';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authSrv: AuthService,
    private uiSrv: UIService,
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err) => {
        const authUser = this.authSrv.getCurrentUser();
        if ([401, 403].includes(err.status) && authUser.id) {
          // auto logout if 401 or 403 response returned from api
          this.authSrv.logout();
        }

        let error = err.statusText;
        if (err && err.error && err.error.message) {
          error = err.error.message;
        } else if (err && err.error && err.error.error && err.error.error.message) {
          error = err.error.error.message;
        }

        this.uiSrv.showError(error);
        return throwError(() => err);
      })
    );
  }
}
