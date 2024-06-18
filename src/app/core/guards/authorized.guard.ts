import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, filter, map, switchMap, take } from 'rxjs';
import { Store } from '@ngrx/store';

import { authFeature } from '../../modules/auth/store/auth.state';
import { authActions } from '../../modules/auth/store/auth.actions';

export const authorizedGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => {
  const store = inject(Store);

  return store.select(authFeature.selectIsInit).pipe(
    filter((isInit) => !!isInit),
    switchMap(() => store.select(authFeature.selectIsAuth)),
    map((isAuth) => {
      if (!isAuth) {
        store.dispatch(authActions.loginRedirect({ url: state.url }));
        return false;
      }

      return true;
    }),
    take(1)
  );
};
