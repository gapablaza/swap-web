import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  exhaustMap,
  filter,
  map,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';

import {
  AuthenticationService,
  JwtService,
  MessageService,
} from 'src/app/core';
import { authFeature } from './auth.state';
import { authActions } from './auth.actions';

@Injectable()
export class AuthEffects {
  // Si existe token, intenta autenticar automáticamente
  autoLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.autoLogin),
      exhaustMap(() => {
        if (this.jwtSrv.getToken()) {
          return this.authSrv.me().pipe(
            map((res) => {
              return authActions.authSuccess({
                user: res.user,
                token: res.token,
                redirect: false,
              });
            }),
            catchError((error) => of(authActions.authFailure()))
          );
        } else {
          this.jwtSrv.destroyToken();
          // return of(authActions.logout());
          return of(authActions.authFailure());
        }
      })
    )
  );

  // Inicia sesión con email / pass
  loginWithEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.loginWithEmail),
      exhaustMap((action) =>
        this.authSrv.loginWithEmail(action.email, action.password).pipe(
          map((res) => {
            return authActions.authSuccess({
              user: res.user,
              token: res.token,
              redirect: true,
            });
          }),
          catchError((error) => of(authActions.authFailure()))
        )
      )
    )
  );

  // Si autentica, guarda token y redirige
  // si no está deshabilitado, intenta iniciar en Firebase
  authSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.authSuccess),
      tap(({ user, token, redirect }) => {
        this.jwtSrv.saveToken(token);
        if (redirect) {
          this.router.navigate(['/']); // redirect to previous page
        }
      }),
      filter(({ user, token }) => !user.disabled),
      map(() => authActions.loginFirebase())
    )
  );

  // Inicia sesión en Firebase
  loginInFirebase$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.loginFirebase),
      exhaustMap(() =>
        this.authSrv.loginOnFirebase().pipe(
          map((res) => {
            return authActions.loginFirebaseSuccess();
          }),
          catchError((error) => of(authActions.loginFirebaseFailure()))
        )
      )
    )
  );

  // Si inicia sesión en Firebase, obtiene cantidad de
  // conversaciones no leídas
  unreadMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.loginFirebaseSuccess),
      withLatestFrom(this.store.select(authFeature.selectUser)),
      switchMap(([action, user]) =>
        this.messageSrv.unreads(user.id).pipe(
          map((unreads) => {
            return authActions.loadUnreadsSuccess({ unreads });
          }),
          catchError((error) => of(authActions.loadUnreadsFailure()))
        )
      )
    )
  );

  // Redirige a la página de login
  loginRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.loginRedirect),
        map((action) => action.url),
        tap((url) => {
          console.log(url);
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: url },
          });
        })
      ),
    { dispatch: false }
  );

  // Cierra sesión
  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.logout),
        tap(() => {
          this.jwtSrv.destroyToken();
          this.router.navigate(['/']);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private router: Router,
    private jwtSrv: JwtService,
    private authSrv: AuthenticationService,
    private messageSrv: MessageService
  ) {}
}
