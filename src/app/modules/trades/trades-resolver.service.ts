import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { catchError, filter, map, Observable } from 'rxjs';

import { AuthService, Collection, User, UserService } from 'src/app/core';

@Injectable({
  providedIn: 'root',
})
export class TradesResolver implements Resolve<Collection[]> {
  authUser: User = {} as User;

  constructor(
    private userSrv: UserService,
    private authSrv: AuthService,
    private router: Router
  ) {
    this.authUser = this.authSrv.getCurrentUser();
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.userSrv.getCollections(this.authUser.id).pipe(
      map((data) => data.collections),
      map((cols) => cols.filter((col) => (col.userSummary?.wishing || 0) > 0)),
      map((cols) =>
        cols.sort((a, b) => {
          return a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()
            ? 1
            : -1;
        })
      ),
      catchError((err) => this.router.navigateByUrl('/'))
    );
  }
}
