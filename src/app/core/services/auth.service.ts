import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Observable,
  BehaviorSubject,
  ReplaySubject,
  from,
  of,
  combineLatest,
} from 'rxjs';
import { concatMap, distinctUntilChanged, map, take } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
// import firebase from 'firebase/compat/app';

import { User } from '../models';
import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
// import { StorageService } from './storage.service';

@Injectable()
export class AuthService {
  private authUserSubject = new BehaviorSubject<User>({} as User);
  public authUser = this.authUserSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  private isAuthSubject = new ReplaySubject<boolean>(1);
  public isAuth = this.isAuthSubject.asObservable();

  private isFBAuthSubject = new ReplaySubject<boolean>(1);
  public isFBAuth = this.isFBAuthSubject.asObservable();

  constructor(
    // private storageSrv: StorageService,
    private apiSrv: ApiService,
    private jwtSrv: JwtService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private afMessaging: AngularFireMessaging,
    private afDB: AngularFireDatabase
  ) {}

  // Verify JWT in localstorage with server & load user's info.
  // This runs once on application startup.
  populate() {
    // If JWT detected, attempt to get & store user's info
    if (this.jwtSrv.getToken()) {
      this.apiSrv.get('/v2/me').subscribe({
        next: (data: { data: User; token: string }) => {
          this.setAuth(data);
        },
        error: (err) => {
          this.purgeAuth();
        },
      });
    } else {
      // Remove any potential remnants of previous auth states
      this.purgeAuth();
    }
  }

  setAuth(user: { data: User; token: string }) {
    // Save JWT sent from server in localstorage
    this.jwtSrv.saveToken(user.token);
    // Set current user data into observable
    this.authUserSubject.next(user.data);
    // Set isAuthenticated to true
    this.isAuthSubject.next(true);
    // try to login on Firebase if not disabled
    if (user.data.disabled) {
      this.isFBAuthSubject.next(false);
    } else {
      this.loginOnFirebase();
    }
  }

  purgeAuth() {
    // try to logout from firebase
    this.logoutOnFirebase();
    // TO DO: try to logout from social networks
    // this.socialSrv.signOut();
    // Remove JWT from localstorage
    this.jwtSrv.destroyToken();
    // Set current user to an empty object
    this.authUserSubject.next({} as User);
    // Set auth status to false
    this.isAuthSubject.next(false);
  }

  emailSignup(
    displayName: string,
    email: string,
    password: string
  ): Observable<boolean> {
    return this.apiSrv
      .post('/v2/auth/signup', { displayName, email, password })
      .pipe(
        take(1),
        concatMap((appToken) => {
          this.jwtSrv.saveToken(appToken.token);
          return this.apiSrv.get('/v2/me').pipe(
            map((data: { data: User; token: string }) => {
              this.setAuth(data);
              return true;
            })
          );
        })
      );
  }

  emailLogin(email: string, password: string): Observable<boolean> {
    return this.apiSrv.post('/v2/auth/login', { email, password }).pipe(
      take(1),
      concatMap((appToken) => {
        this.jwtSrv.saveToken(appToken.token);
        return this.apiSrv.get('/v2/me').pipe(
          map((data: { data: User; token: string }) => {
            this.setAuth(data);
            return true;
          })
        );
      })
    );
  }

  // Registro con Google ID
  googleSignup(data: {
    id: string;
    name: string;
    email: string;
    image: string;
  }): Observable<boolean> {
    return this.apiSrv
      .post('/v2/auth/signupWithGoogleId', {
        id: data.id,
        name: data.name,
        email: data.email,
        image: data.image,
      })
      .pipe(
        take(1),
        concatMap((appToken) => {
          this.jwtSrv.saveToken(appToken.token);
          return this.apiSrv.get('/v2/me').pipe(
            map((data: { data: User; token: string }) => {
              this.setAuth(data);
              return true;
            })
          );
        })
      );
  }

  googleIdLogin(google: string): Observable<boolean> {
    return this.apiSrv.post('/v2/auth/googleWithId', { google }).pipe(
      take(1),
      concatMap((appToken) => {
        this.jwtSrv.saveToken(appToken.token);
        return this.apiSrv.get('/v2/me').pipe(
          map((data: { data: User; token: string }) => {
            this.setAuth(data);
            return true;
          })
        );
      })
    );
  }

  facebookIdLogin(facebook: string): Observable<boolean> {
    return this.apiSrv.post('/v2/auth/facebookWithId', { facebook }).pipe(
      take(1),
      concatMap((appToken) => {
        this.jwtSrv.saveToken(appToken.token);
        return this.apiSrv.get('/v2/me').pipe(
          map((data: { data: User; token: string }) => {
            this.setAuth(data);
            return true;
          })
        );
      })
    );
  }

  loginOnFirebase() {
    this.apiSrv
      .get('/v2/me/firebase')
      .pipe(
        take(1),
        concatMap((data: any) => {
          return from(this.afAuth.signInWithCustomToken(data.tokenFB));
        })
      )
      .subscribe({
        next: () => {
          this.isFBAuthSubject.next(true);
          this.saveFirebaseToken();
        },
        error: () => this.isFBAuthSubject.next(false),
      });
  }

  saveFirebaseToken() {
    let tempAuthUser = this.getCurrentUser();
    if (tempAuthUser.id == null) return;

    this.afMessaging.getToken.pipe(take(1)).subscribe((token) => {
      if (token) {
        this.afDB
          .object(`users/userId_${tempAuthUser.id}/notificationTokens/${token}`)
          .set(true);
      }
    });
  }

  logoutOnFirebase() {
    let tempAuthUser = this.getCurrentUser();

    // remove FB device token
    this.afMessaging.getToken
      .pipe(
        take(1),
        concatMap((token) => {
          if (token) {
            if (tempAuthUser.id != null) {
              const server$ = from(
                this.afDB
                  .object(
                    `users/userId_${tempAuthUser.id}/notificationTokens/${token}`
                  )
                  .remove()
              );
              const client$ = this.afMessaging.deleteToken(token).pipe(take(1));

              return combineLatest([server$, client$]).pipe(
                map(([server, client]) => client)
              );
            } else {
              return this.afMessaging.deleteToken(token).pipe(take(1));
            }
          } else {
            return of(false);
          }
        }),
        concatMap((resp) => {
          // console.log(resp ? 'Token deleted!' : 'Token cant be deleted');
          return from(this.afAuth.signOut());
        })
      )
      .subscribe((resp) => {
        this.isFBAuthSubject.next(false);
      });
  }

  linkGoogle(data: {
    id: string;
    email: string;
    image: string;
  }): Observable<boolean> {
    return this.apiSrv
      .post('/v2/auth/linkGoogleWithId', {
        id: data.id,
        email: data.email,
        image: data.image,
      })
      .pipe(
        take(1),
        concatMap((appToken) => {
          this.jwtSrv.saveToken(appToken.token);
          return this.apiSrv.get('/v2/me').pipe(
            map((data: { data: User; token: string }) => {
              this.setAuth(data);
              return true;
            })
          );
        })
      );
  }

  linkFacebook(data: { id: string; email: string }): Observable<boolean> {
    return this.apiSrv
      .post('/v2/auth/linkFacebookWithId', { id: data.id, email: data.email })
      .pipe(
        take(1),
        concatMap((appToken) => {
          this.jwtSrv.saveToken(appToken.token);
          return this.apiSrv.get('/v2/me').pipe(
            map((data: { data: User; token: string }) => {
              this.setAuth(data);
              return true;
            })
          );
        })
      );
  }

  unlink(provider: 'facebook' | 'google'): Observable<boolean> {
    return this.apiSrv.post('/v2/auth/unlink', { provider }).pipe(
      take(1),
      concatMap((appToken) => {
        this.jwtSrv.saveToken(appToken.token);
        return this.apiSrv.get('/v2/me').pipe(
          map((data: { data: User; token: string }) => {
            this.setAuth(data);
            return true;
          })
        );
      })
    );
  }

  getCurrentUser(): User {
    return this.authUserSubject.value;
  }

  isPRO(): boolean {
    const tempAuthUser = this.authUserSubject.value;
    if (tempAuthUser.id && tempAuthUser.accountTypeId == 2) {
      return true;
    } else {
      return false;
    }
  }

  logout() {
    this.purgeAuth();
    this.router.navigate(['/']);
    // location.reload();
  }

  updateProfile(profile: {
    active: boolean;
    name: string;
    bio?: string;
    addressComponents: string;
  }): Observable<boolean> {
    return this.apiSrv
      .put('/v2/me', {
        address_components: profile.addressComponents,
        bio: profile.bio ? profile.bio : '',
        displayName: profile.name,
        status: profile.active ? 'active' : 'inactive',
      })
      .pipe(
        take(1),
        concatMap(() => {
          return this.apiSrv.get('/v2/me').pipe(
            map((data: { data: User; token: string }) => {
              this.jwtSrv.saveToken(data.token);
              this.authUserSubject.next(data.data);
              return true;
            })
          );
        })
      );
  }

  updateAvatar(image64: string): Observable<boolean> {
    return this.apiSrv.post('/v2/me/avatar', { image: image64 }).pipe(
      take(1),
      concatMap(() => {
        return this.apiSrv.get('/v2/me').pipe(
          map((data: { data: User; token: string }) => {
            this.jwtSrv.saveToken(data.token);
            this.authUserSubject.next(data.data);
            return true;
          })
        );
      })
    );
  }

  removeAvatar(): Observable<boolean> {
    return this.apiSrv.delete('/v2/me/avatar').pipe(
      take(1),
      concatMap(() => {
        return this.apiSrv.get('/v2/me').pipe(
          map((data: { data: User; token: string }) => {
            this.jwtSrv.saveToken(data.token);
            this.authUserSubject.next(data.data);
            return true;
          })
        );
      })
    );
  }

  updateNotifications(notify: boolean): Observable<boolean> {
    return this.apiSrv
      .put('/v2/me/notify', {
        notify,
      })
      .pipe(
        take(1),
        concatMap(() => {
          return this.apiSrv.get('/v2/me').pipe(
            map((data: { data: User; token: string }) => {
              this.jwtSrv.saveToken(data.token);
              this.authUserSubject.next(data.data);
              return true;
            })
          );
        })
      );
  }

  changeEmail(newEmail: string): Observable<boolean> {
    return this.apiSrv
      .get(
        '/v2/me/changeEmail',
        new HttpParams({
          fromObject: {
            newEmail,
          },
        })
      )
      .pipe(
        take(1),
        map(() => {
          return true;
        })
      );
  }

  resetPassword(email: string): Observable<string> {
    return this.apiSrv
      .post('/v2/auth/forgotPassword', { email })
      .pipe(map((data: { message: string }) => data.message));
  }

  setNewPassword(
    newPassword: string,
    userId: number,
    hash: string
  ): Observable<string> {
    return this.apiSrv
      .post('/v2/auth/setNewPassword', {
        newPassword,
        userId,
        hash,
      })
      .pipe(map((data: { message: string }) => data.message));
  }

  delete(): Observable<string> {
    return this.apiSrv
      .delete('/v2/me')
      .pipe(map((data: { message: string }) => data.message));
  }
}
