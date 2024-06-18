import { Injectable } from '@angular/core';
import { Auth, signInWithCustomToken } from '@angular/fire/auth';
import { Observable, concatMap, from, map, take } from 'rxjs';

import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { User } from '../models';

@Injectable()
export class AuthenticationService {
  constructor(
    private apiSrv: ApiService,
    private jwtSrv: JwtService,
    private firebaseAuth: Auth
  ) {}

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

  loginOnFirebase() {
    return this.apiSrv.get('/v2/me/firebase').pipe(
      take(1),
      concatMap((data: any) => {
        return from(signInWithCustomToken(this.firebaseAuth, data.tokenFB));
      })
    );
  }
}
