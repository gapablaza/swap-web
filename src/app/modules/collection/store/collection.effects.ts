import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, tap, withLatestFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { CollectionService } from 'src/app/core';
import { collectionActions } from './collection.actions';
import { collectionFeature } from './collection.state';
import { authFeature } from '../../auth/store/auth.state';
import { UIService } from 'src/app/shared';

@Injectable()
export class CollectionEffects {
  public loadData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(collectionActions.loadData),
      withLatestFrom(
        this.store.select(collectionFeature.selectCollection),
        this.store.select(collectionFeature.selectLastCollectors),
        this.store.select(collectionFeature.selectLastMedia)
      ),
      exhaustMap(([action, collection, lastCollectors, lastMedia]) => {
        // si la colección solicitada ya está en el Store
        if (action.collectionId === collection?.id) {
          return of(
            collectionActions.loadDataSuccess({
              collection,
              lastCollectors,
              lastMedia,
            })
          );
        }

        return this.colSrv.get(action.collectionId).pipe(
          map((collection) =>
            collectionActions.loadDataSuccess({
              collection: collection.collection,
              lastCollectors: collection.lastCollectors,
              lastMedia: collection.lastMedia,
            })
          ),
          catchError((error) =>
            of(collectionActions.loadDataFailure({ error }))
          )
        );
      })
    )
  );

  public loadItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(collectionActions.loadItems),
      withLatestFrom(
        this.store.select(collectionFeature.selectCollection),
        this.store.select(collectionFeature.selectItems)
      ),
      exhaustMap(([action, collection, items]) => {
        // si los items ya están en el Store
        if (items.length > 0) {
          return of(collectionActions.loadItemsSuccess({ items }));
        }

        return this.colSrv.getItems(collection!.id).pipe(
          map((items) => collectionActions.loadItemsSuccess({ items })),
          catchError((error) =>
            of(collectionActions.loadItemsFailure({ error }))
          )
        );
      })
    )
  );

  public add$ = createEffect(() =>
    this.actions$.pipe(
      ofType(collectionActions.add),
      withLatestFrom(
        this.store.select(collectionFeature.selectCollection),
        this.store.select(authFeature.selectUser)
      ),
      exhaustMap(([action, collection, authUser]) =>
        this.colSrv.add(collection!.id).pipe(
          map((message) => collectionActions.addSuccess({ message, authUser })),
          catchError((error) => of(collectionActions.addFailure({ error })))
        )
      )
    )
  );

  public remove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(collectionActions.remove),
      withLatestFrom(
        this.store.select(collectionFeature.selectCollection),
        this.store.select(authFeature.selectUser)
      ),
      exhaustMap(([action, collection, authUser]) =>
        this.colSrv.remove(collection!.id).pipe(
          map((message) =>
            collectionActions.removeSuccess({ message, authUser })
          ),
          catchError((error) => of(collectionActions.removeFailure({ error })))
        )
      )
    )
  );

  public toggleCompleted$ = createEffect(() =>
    this.actions$.pipe(
      ofType(collectionActions.toggleCompleted),
      map((action) => action.completed),
      withLatestFrom(this.store.select(collectionFeature.selectCollection)),
      exhaustMap(([completed, collection]) =>
        this.colSrv.setCompleted(collection!.id, completed).pipe(
          map((message) =>
            collectionActions.toggleCompletedSuccess({ message, completed })
          ),
          catchError((error) =>
            of(collectionActions.toggleCompletedFailure({ error }))
          )
        )
      )
    )
  );

  public loadTops$ = createEffect(() =>
    this.actions$.pipe(
      ofType(collectionActions.loadTops),
      withLatestFrom(this.store.select(collectionFeature.selectCollection)),
      exhaustMap(([action, collection]) =>
        this.colSrv.getTops(collection!.id).pipe(
          map((tops) => collectionActions.loadTopsSuccess({ tops })),
          catchError((error) =>
            of(collectionActions.loadTopsFailure({ error }))
          )
        )
      )
    )
  );

  public loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(collectionActions.loadUsers),
      withLatestFrom(this.store.select(collectionFeature.selectCollection)),
      exhaustMap(([action, collection]) =>
        this.colSrv.getUsers(collection!.id).pipe(
          map((users) => collectionActions.loadUsersSuccess({ users })),
          catchError((error) =>
            of(collectionActions.loadUsersFailure({ error }))
          )
        )
      )
    )
  );

  public loadMedia$ = createEffect(() =>
    this.actions$.pipe(
      ofType(collectionActions.loadMedia),
      withLatestFrom(
        this.store.select(collectionFeature.selectCollection),
        this.store.select(collectionFeature.selectMedia)
      ),
      exhaustMap(([action, collection, media]) => {
        // si los media ya están en el Store
        if (media.length > 0) {
          return of(collectionActions.loadMediaSuccess({ media }));
        }

        return this.colSrv.getMedia(collection!.id).pipe(
          map((media) => collectionActions.loadMediaSuccess({ media })),
          catchError((error) =>
            of(collectionActions.loadMediaFailure({ error }))
          )
        );
      })
    )
  );

  public showSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          collectionActions.addSuccess,
          collectionActions.removeSuccess,
          collectionActions.toggleCompletedSuccess
        ),
        map((action) => action.message),
        tap((message) => {
          this.dialog.closeAll();
          this.uiSrv.showSuccess(message);
        })
      ),
    { dispatch: false }
  );

  public constructor(
    private actions$: Actions,
    private store: Store,
    private colSrv: CollectionService,
    private uiSrv: UIService,
    private dialog: MatDialog
  ) {}
}
