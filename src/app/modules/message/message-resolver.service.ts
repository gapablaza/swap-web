import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { catchError, Observable } from 'rxjs';

import { User, UserService } from 'src/app/core';

@Injectable({
  providedIn: 'root',
})
export class MessageResolver implements Resolve<User> {
  constructor(private userSrv: UserService, private router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.userSrv
      .get(Number(route.params['userId']))
      .pipe(catchError((err) => this.router.navigateByUrl('/')));
  }
}
