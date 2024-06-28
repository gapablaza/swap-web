import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { catchError, filter, first, map, Observable, of, tap } from 'rxjs';

import { collectionFeature } from './store/collection.state';
import { collectionActions } from './store/collection.actions';

@Injectable()
export class CollectionResolver {
  constructor(private store: Store) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const colId = route.paramMap.get('id');

    if (!colId) {
      return of(false);
    }

    return this.store.select(collectionFeature.selectIsLoaded).pipe(
      tap((isLoaded) => {
        if (!isLoaded) {
          this.store.dispatch(
            collectionActions.loadData({ collectionId: +colId })
          );
        }
      }),
      filter((isLoaded) => isLoaded),
      map(() => true),
      first(),
      catchError(() => of(false))
    );
  }
}
