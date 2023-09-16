import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services';
import { map, take } from 'rxjs';

export const authorizedGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const authSrv = inject(AuthService);

  return authSrv.isAuth.pipe(
    take(1),
    map((isAuth) => {
      if (isAuth) {
        return true;
      } else {
        router.navigate(['/login'], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      }
    })
  );
};
