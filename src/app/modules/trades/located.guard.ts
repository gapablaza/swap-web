import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { filter, map, take } from 'rxjs';
import { AuthService } from 'src/app/core';
import { UIService } from 'src/app/shared';

export const locatedGuard = () => {
  const router = inject(Router);
  const authSrv = inject(AuthService);
  const uiSrv = inject(UIService);

  return authSrv.authUser.pipe(
    filter((user) => user.id != null),
    take(1),
    map((user) => {
      if (user.location_city) {
        return true;
      } else {
        uiSrv.showError(
          'Debes indicar tu ubicación para poder proponerte posibles cambios!'
        );
        router.navigate(['/settings']);
        return false;
      }
    })
  );
};
