import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, withLatestFrom } from 'rxjs';

import { PublisherService } from 'src/app/core';
import { publisherActions } from './publisher.actions';
import { Store } from '@ngrx/store';
import { publisherFeature } from './publisher.state';

@Injectable()
export class PublisherEffects {
  public loadAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(publisherActions.loadAll),
      withLatestFrom(this.store.select(publisherFeature.selectPublishers)),
      exhaustMap(([, publishers]) => {
        // si las editoriales ya están en el Store
        if (publishers.length > 0) {
          return of(publisherActions.loadAllSuccess({ publishers }));
        }

        return this.pubSrv.list().pipe(
          map((publishers) => publisherActions.loadAllSuccess({ publishers })),
          catchError((error) => of(publisherActions.loadAllFailure({ error })))
        );
      })
    )
  );

  public loadOne$ = createEffect(() =>
    this.actions$.pipe(
      ofType(publisherActions.load),
      exhaustMap(({ publisherId }) =>
        this.pubSrv.get(publisherId).pipe(
          map(({ data, lastCollections }) =>
            publisherActions.loadSuccess({ publisher: data, lastCollections })
          ),
          catchError((error) => of(publisherActions.loadFailure({ error })))
        )
      )
    )
  );

  public constructor(
    private actions$: Actions,
    private pubSrv: PublisherService,
    private store: Store
  ) {}
}
