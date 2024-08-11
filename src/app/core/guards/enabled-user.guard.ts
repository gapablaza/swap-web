import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';

import { authFeature } from 'src/app/modules/auth/store/auth.state';

export const enabledUserGuard = () => {
  const router = inject(Router);
  const store = inject(Store);

  return store.select(authFeature.selectIsInit).pipe(
    filter((isInit) => !!isInit),
    switchMap(() => store.select(authFeature.selectUser)),
    map((user) => {
      if (user.id && !user.disabled) {
        return true;
      } else {
        router.navigate(['/']);
        return false;
      }
    })
  );
};
