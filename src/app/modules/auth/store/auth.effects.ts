import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  exhaustMap,
  filter,
  from,
  interval,
  map,
  of,
  startWith,
  switchMap,
  take,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs';
import {
  FacebookLoginProvider,
  SocialAuthService,
} from '@abacritt/angularx-social-login';
import { MatDialog } from '@angular/material/dialog';

import {
  AuthenticationService,
  JwtService,
  MessageService,
} from 'src/app/core';
import { authFeature } from './auth.state';
import { authActions } from './auth.actions';
import { UIService } from 'src/app/shared';

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
          return of(authActions.authFailure());
        }
      })
    )
  );

  // Si se carga login, esuchamos google
  loginWithGoogle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.loginPageOpened),
      exhaustMap(() =>
        this.socialSrv.authState.pipe(
          takeUntil(this.actions$.pipe(ofType(authActions.loginPageDestroyed))),
          filter((user) => user != null && user.provider == 'GOOGLE'),
          switchMap((user) =>
            this.authSrv.loginWithGoogleId(user.id).pipe(
              map(({ user, token }) =>
                authActions.authSuccess({ user, token, redirect: true })
              ),
              catchError((error) => of(authActions.authFailure()))
            )
          )
        )
      )
    )
  );

  // Inicia sesión con email/pass
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

  // Inicia sesión con facebook
  loginWithFacebook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.loginFacebook),
      exhaustMap(() =>
        from(this.socialSrv.signIn(FacebookLoginProvider.PROVIDER_ID)).pipe(
          take(1),
          filter((user) => user != null),
          switchMap((user) =>
            this.authSrv.loginWithFacebookId(user.id).pipe(
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
      )
    )
  );

  // Si autentica, guarda token y redirige
  // si no está deshabilitado, intenta iniciar en Firebase
  authSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.authSuccess, authActions.signupSuccess),
      tap(({ user, token, redirect }) => {
        this.jwtSrv.saveToken(token);
        if (redirect) {
          const returnUrl =
            this.router.routerState.snapshot.root.queryParams['returnUrl'] ||
            '/';
          this.router.navigate([returnUrl]);
        }
      }),
      map(({ user }) => {
        if (!user.disabled) {
          return authActions.loginFirebase();
        } else {
          return authActions.loginFirebaseFailure();
        }
      })
    )
  );

  // Crea cuenta con email/pass
  signupWithEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.signupEmail),
      exhaustMap((action) =>
        this.authSrv
          .signupWithEmail(action.name, action.email, action.password)
          .pipe(
            map(({ user, token }) =>
              authActions.signupSuccess({
                message: 'Cuenta creada exitosamente',
                user,
                token,
                redirect: true,
              })
            ),
            catchError((error) => {
              let errorMsg = 'No se pudo crear la cuenta';
              if (error.message) {
                errorMsg += ': ';
                for (var prop in error.message) {
                  if (
                    Object.prototype.hasOwnProperty.call(error.message, prop)
                  ) {
                    errorMsg +=
                      '- ' + (error.message[prop] as []).join(' -') + '. ';
                  }
                }
              }

              return of(authActions.signupFailure({ error: errorMsg }));
            })
          )
      )
    )
  );

  // Si se carga signup, esuchamos google
  signupWithGoogle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.signupPageOpened),
      exhaustMap(() =>
        this.socialSrv.authState.pipe(
          takeUntil(
            this.actions$.pipe(ofType(authActions.signupPageDestroyed))
          ),
          filter((user) => user != null && user.provider == 'GOOGLE'),
          switchMap((user) =>
            this.authSrv
              .signupWithGoogle(user.id, user.name, user.email, user.photoUrl)
              .pipe(
                map(({ user, token }) =>
                  authActions.signupSuccess({
                    message: 'Cuenta creada exitosamente',
                    user,
                    token,
                    redirect: true,
                  })
                ),
                catchError((error) => {
                  let errorMsg = 'No se pudo crear la cuenta';
                  if (error.error && error.error.message) {
                    errorMsg += ' - ' + error.error.message;
                  }

                  return of(authActions.signupFailure({ error: errorMsg }));
                })
              )
          )
        )
      )
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
          takeUntil(this.actions$.pipe(ofType(authActions.logoutStart))),
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
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: url },
          });
        })
      ),
    { dispatch: false }
  );

  // reset password
  resetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.resetPassword),
      map((action) => action.email),
      exhaustMap((email) =>
        this.authSrv.resetPassword(email).pipe(
          map((message) => authActions.resetPasswordSuccess({ message })),
          catchError((error) =>
            of(authActions.resetPasswordFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // new password
  newPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.newPassword),
      exhaustMap((action) =>
        this.authSrv
          .setNewPassword(action.newPassword, action.userId, action.hash)
          .pipe(
            map((message) => {
              this.router.navigate(['/login']);
              return authActions.newPasswordSuccess({ message });
            }),
            catchError((error) =>
              of(authActions.newPasswordFailure({ error: error.message }))
            )
          )
      )
    )
  );

  // update profile
  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.updateProfile),
      exhaustMap((action) =>
        this.authSrv
          .updateProfile({
            active: action.active,
            name: action.name,
            bio: action.bio,
            addressComponents: action.addressComponents,
          })
          .pipe(
            map(({ user, token }) => {
              return authActions.updateProfileSuccess({
                message: 'Perfil actualizado exitosamente',
                user,
                token,
              });
            }),
            catchError((error) =>
              of(
                authActions.updateProfileFailure({
                  error:
                    'No se pudo actualizar tu perfil. Intenta nuevamente mas tarde por favor.',
                })
              )
            )
          )
      )
    )
  );

  // update avatar
  updateAvatar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.updateAvatar),
      map((action) => action.image64),
      exhaustMap((image) =>
        this.authSrv.updateAvatar(image).pipe(
          map(({ user, token }) => {
            return authActions.updateAvatarSuccess({
              message: 'Imagen cambiada con éxito',
              user,
              token,
            });
          }),
          catchError((error) =>
            of(
              authActions.updateAvatarFailure({
                error: 'No se pudo registrar la imagen',
              })
            )
          )
        )
      )
    )
  );

  // remove avatar
  removeAvatar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.removeAvatar),
      exhaustMap(() =>
        this.authSrv.removeAvatar().pipe(
          map((message) => {
            return authActions.removeAvatarSuccess({ message });
          }),
          catchError((error) =>
            of(
              authActions.removeAvatarFailure({
                error: 'No se pudo remover tu imagen de perfil',
              })
            )
          )
        )
      )
    )
  );

  // Si se carga connect, escuchamos google
  linkGoogle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.connectPageOpened),
      exhaustMap(() =>
        this.socialSrv.authState.pipe(
          takeUntil(
            this.actions$.pipe(ofType(authActions.connectPageDestroyed))
          ),
          withLatestFrom(this.store.select(authFeature.selectUser)),
          filter(([, authUser]) => authUser.google == null),
          filter(([user]) => user != null && user.provider == 'GOOGLE'),
          switchMap(([user]) =>
            this.authSrv.linkGoogle(user.id, user.email, user.photoUrl).pipe(
              map(({ user, token }) => {
                this.socialSrv.signOut().catch(() => {});

                return authActions.connectPageSuccess({
                  message: 'Cuenta vinculada exitosamente',
                  user,
                  token,
                });
              }),
              catchError((error) => {
                let errorMsg = 'No se pudo vincular Google';
                if (error.error && error.error.message) {
                  errorMsg += ' - ' + error.error.message;
                }

                return of(authActions.connectPageFailure({ error: errorMsg }));
              })
            )
          )
        )
      )
    )
  );

  // Link facebook
  linkFacebook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.linkFacebook),
      exhaustMap(() =>
        from(this.socialSrv.signIn(FacebookLoginProvider.PROVIDER_ID)).pipe(
          take(1),
          filter((user) => user != null),
          switchMap((user) =>
            this.authSrv.linkFacebook(user.id, user.email).pipe(
              map((res) => {
                return authActions.linkFacebookSuccess({
                  message: 'Cuenta vinculada exitosamente',
                  user: res.user,
                  token: res.token,
                });
              }),
              catchError((error) => {
                let errorMsg = 'No se pudo vincular Facebook';
                if (error.error && error.error.message) {
                  errorMsg += ' - ' + error.error.message;
                }

                return of(authActions.linkFacebookFailure({ error: errorMsg }));
              })
            )
          )
        )
      )
    )
  );

  // unlink network
  unlinkNetwork$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.unlinkNetwork),
      map((action) => action.network),
      exhaustMap((network) =>
        this.authSrv.unlink(network).pipe(
          map((message) => {
            return authActions.unlinkNetworkSuccess({
              message,
              network,
            });
          }),
          catchError((error) =>
            of(
              authActions.unlinkNetworkFailure({
                error: `No se pudo remover ${network} de tu perfil`,
              })
            )
          )
        )
      )
    )
  );

  // unread notifications
  unreadNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.unreadNotification),
      map((action) => action.notifyUnreads),
      exhaustMap((notifyUnreads) =>
        this.authSrv.updateNotifications(notifyUnreads).pipe(
          map((message) => {
            return authActions.unreadNotificationSuccess({
              message,
              notifyUnreads,
            });
          }),
          catchError((error) =>
            of(
              authActions.unreadNotificationFailure({
                error:
                  'No se pudo actualizar tu configuración. Intenta nuevamente mas tarde por favor.',
              })
            )
          )
        )
      )
    )
  );

  // delete account
  deleteAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.deleteAccount),
      exhaustMap(() =>
        this.authSrv.delete().pipe(
          map((message) => {
            return authActions.deleteAccountSuccess({ message });
          }),
          catchError((error) =>
            of(
              authActions.deleteAccountFailure({
                error: 'No se pudo eliminar tu cuenta',
              })
            )
          )
        )
      )
    )
  );

  // delete account success
  deleteAccountSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.deleteAccountSuccess),
      map(() => authActions.logoutStart())
    )
  );

  // Cierra sesión
  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.logoutStart),
        withLatestFrom(
          this.store.select(authFeature.selectIsFirebaseAuth),
          this.store.select(authFeature.selectUser)
        ),
        tap(([action, isFirebaseAuth, authUser]) => {
          if (isFirebaseAuth) {
            this.authSrv.logoutFromFirebase(authUser);
          }
          this.authSrv.setAuthOnlineStatus(authUser.id, false);
          this.jwtSrv.destroyToken();
          this.socialSrv.signOut().catch(() => {});

          this.router.navigate(['/']);
        }),
        map(() => authActions.logoutFinish())
      )
    // { dispatch: false }
  );

  // set online status
  setOnlineUsersStatus$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          authActions.setOnlineStatus,
          authActions.authSuccess,
          authActions.authFailure
        ),
        withLatestFrom(
          this.store.select(authFeature.selectIsAuth),
          this.store.select(authFeature.selectUser)
        ),
        map(([, isAuth, user]) => {
          if (isAuth) {
            this.authSrv.setAuthOnlineStatus(user.id, true);
          } else {
            this.authSrv.setAnonymousOnlineStatus(true);
          }
        })
      ),
    { dispatch: false }
  );

  // set offline status
  setOfflineUsersStatus$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.setOfflineStatus),
        withLatestFrom(
          this.store.select(authFeature.selectIsAuth),
          this.store.select(authFeature.selectUser)
        ),
        map(([, isAuth, user]) => {
          if (isAuth) {
            this.authSrv.setAuthOnlineStatus(user.id, false);
          } else {
            this.authSrv.setAnonymousOnlineStatus(false);
          }
        })
      ),
    { dispatch: false }
  );

  // online users count
  onlineUsersCount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.getOnlineUsersCount),
      switchMap(() =>
        interval(15000).pipe(
          startWith(0),
          switchMap(() =>
            this.authSrv.onlineUsersCount().pipe(
              map((count) => authActions.setOnlineUsersCount({ count })),
              catchError((error) => of(error))
            )
          )
        )
      )
    )
  );

  showSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          authActions.signupSuccess,
          authActions.resetPasswordSuccess,
          authActions.newPasswordSuccess,
          authActions.updateProfileSuccess,
          authActions.updateAvatarSuccess,
          authActions.removeAvatarSuccess,
          authActions.connectPageSuccess,
          authActions.linkFacebookSuccess,
          authActions.unlinkNetworkSuccess,
          authActions.unreadNotificationSuccess,
          authActions.deleteAccountSuccess
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
          authActions.signupFailure,
          authActions.resetPasswordFailure,
          authActions.newPasswordFailure,
          authActions.updateProfileFailure,
          authActions.updateAvatarFailure,
          authActions.removeAvatarFailure,
          authActions.connectPageFailure,
          authActions.linkFacebookFailure,
          authActions.unlinkNetworkFailure,
          authActions.unreadNotificationFailure,
          authActions.deleteAccountFailure
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
    private store: Store,
    private router: Router,
    private jwtSrv: JwtService,
    private socialSrv: SocialAuthService,
    private authSrv: AuthenticationService,
    private messageSrv: MessageService,
    private uiSrv: UIService,
    private dialog: MatDialog
  ) {}
}
