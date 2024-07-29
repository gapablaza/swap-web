import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';

import { ItemService } from 'src/app/core';
import { itemActions } from './item.actions';

@Injectable()
export class ItemEffects {
  public loadData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(itemActions.loadData),
      map((action) => action.itemId),
      exhaustMap((itemId) =>
        this.itemSrv.get(itemId).pipe(
          map(({ item, collection, wishing, trading }) =>
            itemActions.loadDataSuccess({
              item,
              collection,
              wishing,
              trading,
            })
          ),
          catchError((error) => of(itemActions.loadDataFailure({ error })))
        )
      )
    )
  );

  public constructor(private actions$: Actions, private itemSrv: ItemService) {}
}
