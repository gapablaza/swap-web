import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services';
import { map, take } from 'rxjs';

export const fbAuthorizedGuard = () => {
  const router = inject(Router);
  const authSrv = inject(AuthService);

  return authSrv.isFBAuth.pipe(
    take(1),
    map((isAuth) => {
      if (isAuth) {
        return true;
      } else {
        router.navigate(['']);
        return false;
      }
    })
  );
};
