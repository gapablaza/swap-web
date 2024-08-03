import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';

import { AuthenticationService, UserService } from 'src/app/core';
import { UIService } from 'src/app/shared';
import { settingsActions } from './settings.actions';

@Injectable()
export class SettingsEffects {
  // update email
  updateEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(settingsActions.updateEmail),
      map((action) => action.email),
      exhaustMap((email) =>
        this.authSrv.changeEmail(email).pipe(
          map((message) => {
            return settingsActions.updateEmailSuccess({ message });
          }),
          catchError((error) => {
            let errorMsg = 'No se pudo llevar a cabo tu solicitud';
            if (error.error && error.error.message && error.error.fields) {
              errorMsg = `${error.error.message}: `;
              for (var prop in error.error.fields) {
                if (
                  Object.prototype.hasOwnProperty.call(error.error.fields, prop)
                ) {
                  errorMsg +=
                    '- ' + (error.error.fields[prop] as []).join(' -') + '. ';
                }
              }
            }

            return of(
              settingsActions.updateEmailFailure({
                error: errorMsg,
              })
            );
          })
        )
      )
    )
  );

  // load blacklist
  loadBlacklist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(settingsActions.loadBlacklist),
      exhaustMap(() =>
        this.userSrv.getBlacklist().pipe(
          map((blacklist) => {
            return settingsActions.loadBlacklistSuccess({ blacklist });
          }),
          catchError((error) => {
            let errorMsg = 'No se pudo llevar a cabo tu solicitud';
            if (error.error && error.error.message) {
              errorMsg += ' - ' + error.error.message;
            }
            return of(
              settingsActions.loadBlacklistFailure({ error: errorMsg })
            );
          })
        )
      )
    )
  );

  // remove blacklist
  removeBlacklist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(settingsActions.removeBlacklist),
      map((action) => action.userId),
      exhaustMap((userId) =>
        this.userSrv.removeFromBlacklist(userId).pipe(
          map((message) => {
            return settingsActions.removeBlacklistSuccess({ message, userId });
          }),
          catchError((error) =>
            of(settingsActions.removeBlacklistFailure({ error }))
          )
        )
      )
    )
  );

  showSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          settingsActions.updateEmailSuccess,
          settingsActions.removeBlacklistSuccess
        ),
        map((action) => action.message),
        tap((message) => {
          this.uiSrv.showSuccess(message);
        })
      ),
    { dispatch: false }
  );

  showError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          settingsActions.updateEmailFailure,
          settingsActions.removeBlacklistFailure
        ),
        map((action) => action.error),
        tap((error) => {
          this.uiSrv.showError(error);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private authSrv: AuthenticationService,
    private userSrv: UserService,
    private uiSrv: UIService
  ) {}
}
