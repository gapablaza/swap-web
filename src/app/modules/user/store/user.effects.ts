import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  catchError,
  exhaustMap,
  filter,
  map,
  of,
  tap,
  withLatestFrom,
} from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { MediaService, UserService } from 'src/app/core';
import { userActions } from './user.actions';
import { authFeature } from '../../auth/store/auth.state';
import { userFeature } from './user.state';
import { UIService } from 'src/app/shared';
import { Router } from '@angular/router';

@Injectable()
export class UserEffects {
  loadUserData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.loadUserData),
      withLatestFrom(this.store.select(userFeature.selectUser)),
      exhaustMap(([action, user]) => {
        // si el usuario solicitado ya está en el Store
        if (action.userId === user.id) {
          return of(userActions.loadUserDataSuccess({ user }));
        }

        return this.userSrv.profile(action.userId).pipe(
          map((user) => userActions.loadUserDataSuccess({ user })),
          catchError((error) => {
            this.router.navigate(['/not-found']);
            return of(userActions.loadUserDataFailure({ error }))
          })
        );
      })
    )
  );

  loadTrades$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.loadTradesWithAuthUser),
      withLatestFrom(
        this.store.select(userFeature.selectUser),
        this.store.select(authFeature.selectUser)
      ),
      map(([action, user, authUser]) => [user, authUser]),
      filter(
        ([user, authUser]) =>
          authUser.accountTypeId == 2 && authUser.id != user.id
      ),
      exhaustMap(([user]) =>
        this.userSrv.getTradesWithAuthUser(user.id).pipe(
          map((tradesWithUser) => {
            return userActions.loadTradesWithAuthUserSuccess({
              tradesWithUser,
            });
          }),
          catchError((error) =>
            of(userActions.loadTradesWithAuthUserFailure({ error }))
          )
        )
      )
    )
  );

  toggleBlacklist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.toggleBlacklist),
      map((action) => action.blacklist),
      withLatestFrom(this.store.select(userFeature.selectUser)),
      exhaustMap(([blacklist, user]) => {
        if (blacklist) {
          return this.userSrv.addToBlacklist(user.id).pipe(
            map((message) =>
              userActions.toggleBlacklistSuccess({ blacklist, message })
            ),
            catchError((error) =>
              of(userActions.toggleBlacklistFailure({ error }))
            )
          );
        } else {
          return this.userSrv.removeFromBlacklist(user.id).pipe(
            map((message) =>
              userActions.toggleBlacklistSuccess({ blacklist, message })
            ),
            catchError((error) =>
              of(userActions.toggleBlacklistFailure({ error }))
            )
          );
        }
      })
    )
  );

  toggleBlacklistSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userActions.toggleBlacklistSuccess),
        tap((action) => {
          if (action.blacklist) {
            this.uiSrv.showSuccess(action.message);
            this.dialog.closeAll();
          } else {
            this.uiSrv.showSuccess(action.message);
            this.dialog.closeAll();
          }
        })
      ),
    { dispatch: false }
  );

  loadUserEvaluations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.loadUserEvaluations),
      withLatestFrom(this.store.select(userFeature.selectUser)),
      //   filter(([, user]) => user.id != null),
      exhaustMap(([, user]) =>
        this.userSrv.getEvaluations(user.id).pipe(
          map((evaluationsData) =>
            userActions.loadUserEvaluationsSuccess({ evaluationsData })
          ),
          catchError((error) =>
            of(userActions.loadUserEvaluationsFailure({ error }))
          )
        )
      )
    )
  );

  addEvaluation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.addEvaluation),
      withLatestFrom(this.store.select(userFeature.selectUser)),
      exhaustMap(([action, user]) => {
        return this.userSrv
          .addEvaluation(user.id, action.typeId, action.comment)
          .pipe(
            map((message) => userActions.addEvaluationSuccess({ message })),
            catchError((error) =>
              of(userActions.addEvaluationFailure({ error }))
            )
          );
      })
    )
  );

  addEvaluationSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userActions.addEvaluationSuccess),
        tap((action) => {
          this.uiSrv.showSuccess(action.message);
          this.store.dispatch(userActions.loadUserEvaluations());
        })
      ),
    { dispatch: false }
  );

  loadUserCollections$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.loadUserCollections),
      withLatestFrom(this.store.select(userFeature.selectUser)),
      exhaustMap(([, user]) => {
        return this.userSrv.getCollections(user.id).pipe(
          map((resp) =>
            userActions.loadUserCollectionsSuccess({
              collections: resp.collections,
            })
          ),
          catchError((error) =>
            of(userActions.loadUserCollectionsFailure({ error }))
          )
        );
      })
    )
  );

  loadUserCollectionDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.loadUserCollectionDetails),
      withLatestFrom(this.store.select(userFeature.selectUser)),
      exhaustMap(([action, user]) => {
        return this.userSrv
          .getCollectionInfo(user.id, action.collection.id)
          .pipe(
            map((collection) =>
              userActions.loadUserCollectionDetailsSuccess({ collection })
            ),
            catchError((error) =>
              of(userActions.loadUserCollectionDetailsFailure({ error }))
            )
          );
      })
    )
  );

  loadUserMedia$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.loadUserMedia),
      withLatestFrom(this.store.select(userFeature.selectUser)),
      exhaustMap(([, user]) => {
        return this.userSrv.getMedia(user.id).pipe(
          map((media) => userActions.loadUserMediaSuccess({ media })),
          catchError((error) => of(userActions.loadUserMediaFailure({ error })))
        );
      })
    )
  );

  toggleMediaLike$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.toggleMediaLike),
      withLatestFrom(
        this.store.select(authFeature.selectIsAuth),
        this.store.select(userFeature.selectIsProcessing)
      ),
      tap(([, isAuth]) => {
        if (!isAuth)
          this.uiSrv.showError(
            'Debes iniciar sesión para realizar esta acción'
          );
      }),
      filter(([, isAuth, isProcessing]) => isAuth),
      map(([action, ,]) => action),
      exhaustMap((action) => {
        return this.mediaSrv.setLike(action.mediaId, action.likes).pipe(
          map((message) => {
            this.uiSrv.showSuccess(message);
            return userActions.toggleMediaLikeSuccess({
              mediaId: action.mediaId,
              likes: action.likes,
              message,
            });
          }),
          catchError((error) =>
            of(userActions.toggleMediaLikeFailure({ error }))
          )
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private userSrv: UserService,
    private mediaSrv: MediaService,
    private uiSrv: UIService,
    private router: Router,
    private dialog: MatDialog
  ) {}
}
