import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map, switchMap, take } from 'rxjs';

import { UIService } from 'src/app/shared';
import { authFeature } from '../auth/store/auth.state';

export const locatedGuard = () => {
  const router = inject(Router);
  const store = inject(Store);
  const uiSrv = inject(UIService);

  return store.select(authFeature.selectIsInit).pipe(
    filter((isInit) => !!isInit),
    switchMap(() => store.select(authFeature.selectUser)),
    // filter((user) => user.id != null),
    map((user) => {
      if (user.location_city) {
        return true;
      }

      uiSrv.showError(
        'Debes indicar tu ubicación para poder proponerte posibles cambios!'
      );
      router.navigate(['/settings']);
      return false;
    }),
    take(1)
  );
};
