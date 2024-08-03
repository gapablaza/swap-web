import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Auth, signInWithCustomToken, signOut } from '@angular/fire/auth';
import { Observable, concatMap, from, map, take } from 'rxjs';

import { User } from '../models';
import { ApiService } from './api.service';
import { JwtService } from './jwt.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private apiSrv: ApiService,
    private jwtSrv: JwtService,
    private firebaseAuth: Auth
  ) {}

  signupWithEmail(
    displayName: string,
    email: string,
    password: string
  ): Observable<{ user: User; token: string }> {
    return this.apiSrv
      .post('/v2/auth/signup', { displayName, email, password })
      .pipe(
        take(1),
        concatMap((appToken) => {
          this.jwtSrv.saveToken(appToken.token);
          return this.apiSrv.get('/v2/me').pipe(
            map((data: { data: User; token: string }) => {
              return {
                user: data.data,
                token: data.token,
              };
            })
          );
        })
      );
  }

  // Registro con Google ID
  signupWithGoogle(
    id: string,
    name: string,
    email: string,
    image: string
  ): Observable<{ user: User; token: string }> {
    return this.apiSrv
      .post('/v2/auth/signupWithGoogleId', {
        id,
        name,
        email,
        image,
      })
      .pipe(
        take(1),
        concatMap((appToken) => {
          this.jwtSrv.saveToken(appToken.token);
          return this.apiSrv.get('/v2/me').pipe(
            map((data: { data: User; token: string }) => {
              return {
                user: data.data,
                token: data.token,
              };
            })
          );
        })
      );
  }

  loginWithEmail(
    email: string,
    password: string
  ): Observable<{ user: User; token: string }> {
    return this.apiSrv.post('/v2/auth/login', { email, password }).pipe(
      take(1),
      concatMap((appToken) => {
        this.jwtSrv.saveToken(appToken.token);
        return this.apiSrv.get('/v2/me').pipe(
          map((data: { data: User; token: string }) => {
            return {
              user: data.data,
              token: data.token,
            };
          })
        );
      })
    );
  }

  loginWithGoogleId(id: string): Observable<{ user: User; token: string }> {
    return this.apiSrv
      .post('/v2/auth/googleWithId', {
        google: id,
      })
      .pipe(
        take(1),
        concatMap((appToken) => {
          this.jwtSrv.saveToken(appToken.token);
          return this.apiSrv.get('/v2/me').pipe(
            map((data: { data: User; token: string }) => {
              return {
                user: data.data,
                token: data.token,
              };
            })
          );
        })
      );
  }

  loginWithFacebookId(id: string): Observable<{ user: User; token: string }> {
    return this.apiSrv
      .post('/v2/auth/facebookWithId', {
        facebook: id,
      })
      .pipe(
        take(1),
        concatMap((appToken) => {
          this.jwtSrv.saveToken(appToken.token);
          return this.apiSrv.get('/v2/me').pipe(
            map((data: { data: User; token: string }) => {
              return {
                user: data.data,
                token: data.token,
              };
            })
          );
        })
      );
  }

  loginOnFirebase() {
    return this.apiSrv.get('/v2/me/firebase').pipe(
      take(1),
      concatMap((data: any) => {
        return from(signInWithCustomToken(this.firebaseAuth, data.tokenFB));
      })
    );
  }

  me(): Observable<{ user: User; token: string }> {
    return this.apiSrv.get('/v2/me').pipe(
      map((data: { data: User; token: string }) => {
        return {
          user: data.data,
          token: data.token,
        };
      })
    );
  }

  updateProfile(profile: {
    active: boolean;
    name: string;
    bio?: string;
    addressComponents: string;
  }): Observable<{ user: User; token: string }> {
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
              return {
                user: data.data,
                token: data.token,
              };
            })
          );
        })
      );
  }

  updateAvatar(image64: string): Observable<{ user: User; token: string }> {
    return this.apiSrv.post('/v2/me/avatar', { image: image64 }).pipe(
      take(1),
      concatMap(() => {
        return this.apiSrv.get('/v2/me').pipe(
          map((data: { data: User; token: string }) => {
            return {
              user: data.data,
              token: data.token,
            };
          })
        );
      })
    );
  }

  removeAvatar(): Observable<string> {
    return this.apiSrv.delete('/v2/me/avatar').pipe(
      map(() => {
        return 'Imagen removida exitosamente';
      })
    );
  }

  linkGoogle(
    id: string,
    email: string,
    image: string,
  ): Observable<{ user: User; token: string }> {
    return this.apiSrv
      .post('/v2/auth/linkGoogleWithId', {
        id,
        email,
        image,
      })
      .pipe(
        take(1),
        concatMap(() => {
          return this.apiSrv.get('/v2/me').pipe(
            map((data: { data: User; token: string }) => {
              return {
                user: data.data,
                token: data.token,
              };
            })
          );
        })
      );
  }

  linkFacebook(id: string, email: string): Observable<{ user: User; token: string }> {
    return this.apiSrv
      .post('/v2/auth/linkFacebookWithId', { id, email })
      .pipe(
        take(1),
        concatMap(() => {
          return this.apiSrv.get('/v2/me').pipe(
            map((data: { data: User; token: string }) => {
              return {
                user: data.data,
                token: data.token,
              };
            })
          );
        })
      );
  }

  unlink(
    provider: 'facebook' | 'google'
  ): Observable<string> {
    return this.apiSrv.post('/v2/auth/unlink', { provider }).pipe(
      map(() => {
        return `${provider} fue removido exitosamente`
      })
    );
  }

  updateNotifications(notify: boolean): Observable<string> {
    return this.apiSrv
      .put('/v2/me/notify', {
        notify,
      })
      .pipe(
        map(() => {
          return 'Configuración actualizada exitosamente';
        })
      );
  }

  changeEmail(newEmail: string): Observable<string> {
    return this.apiSrv
      .get(
        '/v2/me/changeEmail',
        new HttpParams({
          fromObject: {
            newEmail,
          },
        })
      )
      .pipe(map((data: { message: string }) => data.message));
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

  logoutFromFirebase() {
    signOut(this.firebaseAuth).catch((error) => console.log(error));
    // TO DO: handle remove notificationTokens on client/server
  }

  delete(): Observable<string> {
    return this.apiSrv
      .delete('/v2/me')
      .pipe(map((data: { message: string }) => data.message));
  }
}
