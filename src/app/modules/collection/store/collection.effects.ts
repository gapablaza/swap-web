import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, tap, withLatestFrom } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { CollectionService, ItemService, MediaService } from 'src/app/core';
import { UIService } from 'src/app/shared';
import { authFeature } from '../../auth/store/auth.state';
import { collectionActions } from './collection.actions';
import { collectionFeature } from './collection.state';
import { CollectionMediaUploadComponent } from '../collection-media-upload/collection-media-upload.component';

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
          map((items) =>
            collectionActions.loadItemsSuccess({
              items: items.sort(
                (a, b) => (a.position || 0) - (b.position || 0)
              ),
            })
          ),
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

  public toggleMediaLikes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(collectionActions.toggleMediaLike),
      withLatestFrom(this.store.select(authFeature.selectIsAuth)),
      exhaustMap(([action, isAuth]) => {
        if (!isAuth) {
          return of(collectionActions.requireAuth());
        }

        return this.mediaSrv.setLike(action.mediaId, action.likes).pipe(
          map((message) =>
            collectionActions.toggleMediaLikeSuccess({
              message,
              mediaId: action.mediaId,
              likes: action.likes,
            })
          ),
          catchError((error) =>
            of(collectionActions.toggleMediaLikeFailure({ error }))
          )
        );
      })
    )
  );

  public addImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(collectionActions.addImage),
      withLatestFrom(
        this.store.select(collectionFeature.selectCollection),
        this.store.select(authFeature.selectUser),
        this.store.select(authFeature.selectIsAuth)
      ),
      exhaustMap(([action, collection, authUser, isAuth]) => {
        if (!isAuth) {
          return of(collectionActions.requireAuth());
        }

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.panelClass = ['media-image'];
        dialogConfig.width = '375px';
        dialogConfig.data = {
          collectionId: collection?.id,
        };

        const dialogRef = this.dialog.open<
          CollectionMediaUploadComponent,
          any,
          { description: string; id: number }
        >(CollectionMediaUploadComponent, dialogConfig);

        return dialogRef.afterClosed().pipe(
          map((result) => {
            if (result && result.id) {
              const newMedia = {
                created: Math.floor(new Date().getTime() / 1000),
                description: result.description,
                id: result.id,
                mediaStatusId: 1,
                mediaStatusName: 'Por confirmar',
                mediaTypeId: 1,
                mediaTypeName: 'Imagen',
                user: {
                  data: authUser,
                },
              };
              return collectionActions.addImageSuccess({
                message: 'Imagen subida, a esperar que un moderador la valide!',
                newMedia,
              });
            }

            return collectionActions.addImageFailure({
              error: 'No se ha podido subir la imagen',
            });
          }),
          catchError((error) =>
            of(
              collectionActions.addImageFailure({
                error: 'No se pudo subir la imagen',
              })
            )
          )
        );
      })
    )
  );

  public removeImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(collectionActions.removeImage),
      map((action) => action.mediaId),
      exhaustMap((mediaId) =>
        this.mediaSrv.delete(mediaId).pipe(
          map((message) =>
            collectionActions.removeImageSuccess({ message, mediaId })
          ),
          catchError((error) =>
            of(collectionActions.removeImageFailure({ error }))
          )
        )
      )
    )
  );

  public addComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(collectionActions.addComment),
      map((action) => action.publicComment),
      withLatestFrom(this.store.select(collectionFeature.selectCollection)),
      exhaustMap(([publicComment, collection]) =>
        this.colSrv.addComment(collection!.id, publicComment).pipe(
          map((message) =>
            collectionActions.addCommentSuccess({ message, publicComment })
          ),
          catchError((error) =>
            of(collectionActions.addCommentFailure({ error }))
          )
        )
      )
    )
  );

  public removeComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(collectionActions.removeComment),
      withLatestFrom(this.store.select(collectionFeature.selectCollection)),
      exhaustMap(([, collection]) =>
        this.colSrv.removeComment(collection!.id).pipe(
          map((message) => collectionActions.removeCommentSuccess({ message })),
          catchError((error) =>
            of(collectionActions.removeCommentFailure({ error }))
          )
        )
      )
    )
  );

  public itemAdd$ = createEffect(() =>
    this.actions$.pipe(
      ofType(collectionActions.itemAdd),
      exhaustMap(({ item, listType }) => {
        const method =
          listType == 'wishlist'
            ? this.itemSrv.addToWishlist(item.id)
            : this.itemSrv.addToTradelist(item.id);
        return method.pipe(
          map((message) =>
            collectionActions.itemAddSuccess({ message, item, listType })
          ),
          catchError((error) =>
            of(collectionActions.itemAddFailure({ error, item, listType }))
          )
        );
      })
    )
  );

  public itemIncrement$ = createEffect(() =>
    this.actions$.pipe(
      ofType(collectionActions.itemIncrement),
      exhaustMap(({ item, listType }) => {
        const method =
          listType == 'wishlist'
            ? this.itemSrv.incrementWishlist(item.id)
            : this.itemSrv.incrementTradelist(item.id);
        return method.pipe(
          map(({ message, newQuantity }) =>
            collectionActions.itemIncrementSuccess({
              message,
              item,
              newQuantity,
              listType,
            })
          ),
          catchError((error) =>
            of(
              collectionActions.itemIncrementFailure({ error, item, listType })
            )
          )
        );
      })
    )
  );

  public itemDecrement$ = createEffect(() =>
    this.actions$.pipe(
      ofType(collectionActions.itemDecrement),
      exhaustMap(({ item, listType }) => {
        const method =
          listType == 'wishlist'
            ? this.itemSrv.decrementWishlist(item.id)
            : this.itemSrv.decrementTradelist(item.id);
        return method.pipe(
          map(({ message, newQuantity }) =>
            collectionActions.itemDecrementSuccess({
              message,
              item,
              newQuantity,
              listType,
            })
          ),
          catchError((error) =>
            of(
              collectionActions.itemDecrementFailure({ error, item, listType })
            )
          )
        );
      })
    )
  );

  public itemRemove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(collectionActions.itemRemove),
      exhaustMap(({ item, listType }) => {
        const method =
          listType == 'wishlist'
            ? this.itemSrv.removeFromWishlist(item.id)
            : this.itemSrv.removeFromTradelist(item.id);

        return method.pipe(
          map((message) =>
            collectionActions.itemRemoveSuccess({ message, item, listType })
          ),
          catchError((error) =>
            of(collectionActions.itemRemoveFailure({ error, item, listType }))
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
          collectionActions.toggleCompletedSuccess,
          collectionActions.toggleMediaLikeSuccess,
          collectionActions.addImageSuccess,
          collectionActions.removeImageSuccess,
          collectionActions.addCommentSuccess,
          collectionActions.removeCommentSuccess,
          collectionActions.itemAddSuccess,
          collectionActions.itemIncrementSuccess,
          collectionActions.itemDecrementSuccess,
          collectionActions.itemRemoveSuccess
        ),
        map((action) => action.message),
        tap((message) => {
          this.dialog.closeAll();
          this.uiSrv.showSuccess(message);
        })
      ),
    { dispatch: false }
  );

  public requireAuth$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(collectionActions.requireAuth),
        tap(() => {
          //   this.dialog.closeAll();
          this.uiSrv.showError(
            'Debes iniciar sesión para realizar esta acción'
          );
        })
      ),
    { dispatch: false }
  );

  public constructor(
    private actions$: Actions,
    private store: Store,
    private colSrv: CollectionService,
    private mediaSrv: MediaService,
    private itemSrv: ItemService,
    private uiSrv: UIService,
    private dialog: MatDialog
  ) {}
}
