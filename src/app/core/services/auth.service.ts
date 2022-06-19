import { Injectable } from '@angular/core';
import {
  Observable,
  BehaviorSubject,
  of,
  ReplaySubject,
} from 'rxjs';
import {
  concatMap,
  distinctUntilChanged,
  map,
  take,
} from 'rxjs/operators';

import { User } from '../models';
import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
// import { StorageService } from './storage.service';

@Injectable()
export class AuthService {
  private authUserSubject = new BehaviorSubject<User>({} as User);
  public authUser = this.authUserSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  private isAuthSubject = new ReplaySubject<boolean>(1);
  public isAuth = this.isAuthSubject.asObservable();

  constructor(
    // private storageSrv: StorageService,
    private apiSrv: ApiService,
    private jwtSrv: JwtService
  ) {}

  // Verify JWT in localstorage with server & load user's info.
  // This runs once on application startup.
  populate() {
    // If JWT detected, attempt to get & store user's info
    if (this.jwtSrv.getToken()) {
      this.apiSrv.get('/me').subscribe({
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
    // try to login on Firebase
    // this.loginOnFirebase();
  }

  purgeAuth() {
    // try to logout from firebase
    // this.logoutOnFirebase();
    // Remove JWT from localstorage
    this.jwtSrv.destroyToken();
    // Set current user to an empty object
    this.authUserSubject.next({} as User);
    // Set auth status to false
    this.isAuthSubject.next(false);
  }

  emailLogin(email: string, password: string): Observable<boolean> {
    return this.apiSrv
      .post('/auth/login', { email, password })
      .pipe(
        take(1),
        concatMap((appToken) => {
          this.jwtSrv.saveToken(appToken.token);
          return this.apiSrv.get('/me').pipe(
            map((data: { data: User, token: string }) => {
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
    if (tempAuthUser.id && (tempAuthUser.accountTypeId == 2)) {
      return true;
    } else {
      return false;
    }
  }

  logout() {
    this.purgeAuth();
    location.reload();
  }
}
