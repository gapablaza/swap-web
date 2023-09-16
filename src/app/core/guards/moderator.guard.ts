import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services';
import { map, take } from 'rxjs';

export const moderatorGuard = () => {
  const router = inject(Router);
  const authSrv = inject(AuthService);

  return authSrv.authUser.pipe(
    take(1),
    map((user) => {
      if (user.isMod) {
        return true;
      } else {
        router.navigate(['/']);
        return false;
      }
    })
  );
};
