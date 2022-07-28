import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, ReplaySubject } from 'rxjs';
import { concatMap, distinctUntilChanged, map, take } from 'rxjs/operators';

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
    location.reload();
  }

  updateProfile(profile: {
    active: boolean;
    name: string;
    bio?: string;
    addressComponents: string;
  }): Observable<boolean> {
    return this.apiSrv.put('/v2/me', {
      address_components: profile.addressComponents,
      bio: profile.bio? profile.bio : '',
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
      }),
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
      }),
    );
  }
}
