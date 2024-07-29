import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { catchError, filter, first, map, Observable, of, tap } from 'rxjs';

import { ItemService, User } from 'src/app/core';
import { itemFeature } from './store/item.state';
import { itemActions } from './store/item.actions';

@Injectable()
export class ItemResolver  {
  constructor(private store: Store, private itemSrv: ItemService, private router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const itemId = route.paramMap.get('id');

    if (!itemId) {
      return of(false);
    }

    return this.store
      .select(itemFeature.selectIsLoaded).pipe(
        tap((isLoaded) => {
          if (!isLoaded) {
            this.store.dispatch(itemActions.loadData({ itemId: +itemId }));
          }
        }),
        filter((isLoaded) => isLoaded),
        map(() => true),
        first(),
        catchError(() => of(false))
      )

    // return this.itemSrv
    //   .get(Number(route.params['id']))
    //   .pipe(catchError((err) => this.router.navigateByUrl('/')));
  }
}
