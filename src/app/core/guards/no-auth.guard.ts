import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map, take } from 'rxjs';

import { AuthService } from '../services';

@Injectable()
export class NoAuthGuard  {
  constructor(private router: Router, private authSrv: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authSrv.isAuth.pipe(
      take(1),
      map(isAuth => {
        if (isAuth) {
          // logged in so redirect to home page
          this.router.navigate(['/']);
          return !isAuth;
        } else {
          return true;
        }
      })
    );
  }
}
