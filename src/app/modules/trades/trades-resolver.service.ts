import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { catchError, map, Observable, switchMap, take } from 'rxjs';

import { UserService } from 'src/app/core';
import { authFeature } from '../auth/store/auth.state';

@Injectable()
export class TradesResolver {
  constructor(
    private userSrv: UserService,
    private store: Store,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.store.select(authFeature.selectUser).pipe(
      take(1),
      switchMap((user) =>
        this.userSrv.getCollections(user.id).pipe(
          map((data) => data.collections),
          map((cols) =>
            cols.filter((col) => (col.userSummary?.wishing || 0) > 0)
          ),
          map((cols) =>
            cols.sort((a, b) => {
              return a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()
                ? 1
                : -1;
            })
          ),
          catchError((err) => this.router.navigateByUrl('/'))
        )
      )
    );
  }
}
