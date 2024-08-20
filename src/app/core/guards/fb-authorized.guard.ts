import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { filter, map, switchMap, take } from 'rxjs';
import { Store } from '@ngrx/store';

import { authFeature } from '../../modules/auth/store/auth.state';

export const fbAuthorizedGuard = () => {
  const router = inject(Router);
  const store = inject(Store);

  return store.select(authFeature.selectIsFirebaseInit).pipe(
    filter((isInit) => !!isInit),
    switchMap(() => store.select(authFeature.selectIsFirebaseAuth)),
    map((isAuth) => {
      if (!isAuth) {
        router.navigate(['']);
        return false;
      }

      return true;
    }),
    take(1)
  );
};
