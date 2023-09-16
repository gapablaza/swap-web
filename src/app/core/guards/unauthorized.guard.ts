import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services';
import { map, take } from 'rxjs';

export const unauthorizedGuard = () => {
  const router = inject(Router);
  const authSrv = inject(AuthService);

  return authSrv.isAuth.pipe(
    take(1),
    map((isAuth) => {
      if (isAuth) {
        // logged in so redirect to home page
        router.navigate(['/']);
        return false;
      } else {
        return true;
      }
    })
  );
};
