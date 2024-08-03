import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';

import { MediaService, NewCollectionService } from 'src/app/core';
import { UIService } from 'src/app/shared';
import { modActions } from './mod.actions';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class ModEffects {
  // load media
  loadMedia$ = createEffect(() =>
    this.actions$.pipe(
      ofType(modActions.loadMedia),
      exhaustMap(() =>
        this.mediaSrv.waitingModeration().pipe(
          map((medias) => medias.filter((elem) => elem.mediaTypeId == 1)),
          map((medias) => {
            return modActions.loadMediaSuccess({ medias });
          }),
          catchError((error) =>
            of(
              modActions.loadMediaFailure({
                error,
              })
            )
          )
        )
      )
    )
  );

  // sanction media
  sanctionMedia$ = createEffect(() =>
    this.actions$.pipe(
      ofType(modActions.sanctionMedia),
      exhaustMap((action) =>
        this.mediaSrv.sanction(action.mediaId, action.sanctionId).pipe(
          map((message) => {
            return modActions.sanctionMediaSuccess({
              message,
              mediaId: action.mediaId,
            });
          }),
          catchError((error) => {
            let errorMsg = 'No se pudo llevar a cabo tu solicitud';
            if (error.error && error.error.message) {
              errorMsg = error.error.message;
            }
            return of(
              modActions.sanctionMediaFailure({
                error: errorMsg,
              })
            );
          })
        )
      )
    )
  );

  // load new collections
  loadNewCollections$ = createEffect(() =>
    this.actions$.pipe(
      ofType(modActions.loadNewCollections),
      exhaustMap(() =>
        this.newColSrv
          .list({
            query: '',
            status: 4,
            sortBy: 'votes',
          })
          .pipe(
            map(({ newCollections }) => {
              return modActions.loadNewCollectionsSuccess({ newCollections });
            }),
            catchError((error) =>
              of(
                modActions.loadNewCollectionsFailure({
                  error,
                })
              )
            )
          )
      )
    )
  );

  // publish new collection
  publishNewCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(modActions.publishNewCollection),
      exhaustMap((action) =>
        this.newColSrv.publish(action.newCollectionId, action.security).pipe(
          map(({ message }) => {
            return modActions.publishNewCollectionSuccess({
              message,
              newCollectionId: action.newCollectionId,
            });
          }),
          catchError((error) => {
            let errorMsg = 'No se pudo llevar a cabo tu solicitud';
            if (error.error && error.error.message) {
              errorMsg = error.error.message;
            }
            return of(
              modActions.publishNewCollectionFailure({
                error: errorMsg,
              })
            );
          })
        )
      )
    )
  );

  showSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          modActions.sanctionMediaSuccess,
          modActions.publishNewCollectionSuccess
        ),
        map((action) => action.message),
        tap((message) => {
          this.dialog.closeAll(); // TO DO: Close only in some cases
          this.uiSrv.showSuccess(message);
        })
      ),
    { dispatch: false }
  );

  showError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          modActions.sanctionMediaFailure,
          modActions.publishNewCollectionFailure
        ),
        map((action) => action.error),
        tap((error) => {
          this.dialog.closeAll(); // TO DO: Close only in some cases
          this.uiSrv.showError(error);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private mediaSrv: MediaService,
    private newColSrv: NewCollectionService,
    private uiSrv: UIService,
    private dialog: MatDialog
  ) {}
}
