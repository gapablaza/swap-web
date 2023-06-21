import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map, take } from 'rxjs';

import { AuthService } from '../services';

@Injectable()
export class FBAuthGuard  {
  constructor(
    private router: Router, 
    private authSrv: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    
    return this.authSrv.isFBAuth.pipe(
      take(1),
      map(isAuth => {
        if (isAuth) {
          // logged in so return true
          return true;
        } else {
          // not logged in so redirect 
          this.router.navigate(['']);
          return false;
        }
      })
    );
    
  }
}
