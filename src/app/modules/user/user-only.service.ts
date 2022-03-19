import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, Observable } from 'rxjs';

import { User } from '../../core/models';

@Injectable()
export class UserOnlyService {
  // private _user: User = {} as User;
  private _user = new BehaviorSubject<User>({} as User);
  // user$: Observable<User> = this._user.asObservable();
  user$: Observable<User> = this._user.asObservable().pipe(distinctUntilChanged());

  constructor() { }

  setCurrentUser(user: User) {
    // this._user = user;
    this._user.next(user);
  }

  getCurrentUser() {
    // return this._user;
    return this._user.value;
  }

  cleanCurrentUser() {
    // this._user = {} as User;
    this._user.next({} as User);
  }
}
