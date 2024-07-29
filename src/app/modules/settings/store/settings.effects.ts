import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';

import { AuthenticationService } from 'src/app/core';
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
                if (Object.prototype.hasOwnProperty.call(error.error.fields, prop)) {
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

  showSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(settingsActions.updateEmailSuccess),
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
        ofType(settingsActions.updateEmailFailure),
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
    private uiSrv: UIService
  ) {}
}