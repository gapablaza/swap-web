import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { catchError, Observable } from 'rxjs';

import { User, UserService } from 'src/app/core';
import { authFeature } from '../auth/store/auth.state';

@Injectable({
  providedIn: 'root',
})
export class MessageResolver {
  constructor(
    private userSrv: UserService,
    private store: Store,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    // state: RouterStateSnapshot
  ): Observable<any> {
    // return this.store
    //   .select(authFeature.selectUser)
    //   .pipe(catchError((err) => this.router.navigateByUrl('/')));
    return this.userSrv
      .get(Number(route.params['userId']))
      .pipe(catchError((err) => this.router.navigateByUrl('/')));
  }
}
