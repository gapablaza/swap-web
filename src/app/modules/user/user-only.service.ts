import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, Observable, take } from 'rxjs';

import { UserService } from 'src/app/core';
import { User } from '../../core/models';

@Injectable()
export class UserOnlyService {
  private _user = new BehaviorSubject<User>({} as User);
  user$: Observable<User> = this._user
    .asObservable()
    .pipe(distinctUntilChanged());

  constructor(private userSrv: UserService) {}

  setCurrentUser(user: User) {
    this._user.next(user);
  }

  getCurrentUser() {
    return this._user.value;
  }

  cleanCurrentUser() {
    this._user.next({} as User);
  }

  requestUserUpdate() {
    this.userSrv
      .get(this._user.value.id)
      .pipe(take(1))
      .subscribe((user) => {
        this._user.next(user);
      });
  }
}
