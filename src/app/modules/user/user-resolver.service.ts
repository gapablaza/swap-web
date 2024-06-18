import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { catchError, filter, first, map, Observable, of, tap } from 'rxjs';

import { userFeature } from './store/user.state';
import { userActions } from './store/user.actions';

@Injectable()
export class UserResolver {
  constructor(private store: Store) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const userId = route.paramMap.get('id');

    if (!userId) {
      return of(false);
    }

    return this.store.select(userFeature.selectIsLoaded).pipe(
      tap((isLoaded) => {
        // si es la primera vez, obtenemos el usuario solicitado
        if (!isLoaded) {
          this.store.dispatch(userActions.loadUserData({ userId: +userId }));
        }
      }),
      filter((isLoaded) => isLoaded),
      map(() => true),
      first(),
      catchError(() => of(false))
    );
  }
}
