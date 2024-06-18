import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Store } from '@ngrx/store';

import { UIService } from 'src/app/shared';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const uiSrv = inject(UIService);

  return next(req).pipe(
    catchError((err) => {
      // const authUser = authSrv.getCurrentUser();
      // if ([401, 403].includes(err.status) && authUser.id) {
      //   // auto logout if 401 or 403 response returned from api
      //   authSrv.logout();
      // }

      let error = err.statusText;
      if (err && err.error && err.error.message) {
        error = err.error.message;
      } else if (
        err &&
        err.error &&
        err.error.error &&
        err.error.error.message
      ) {
        error = err.error.error.message;
      }

      uiSrv.showError(error);
      return throwError(() => err);
    })
  );
};
