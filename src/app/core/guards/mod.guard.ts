import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map, take } from 'rxjs';

import { AuthService } from '../services';

@Injectable()
export class ModGuard  {
  constructor(
    private router: Router, 
    private authSrv: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    
    return this.authSrv.authUser.pipe(
      take(1),
      map(user => {
        if (user.isMod) {
          // logged in so return true
          return true;
        } else {
          // the user is not a mod so redirect to home
          this.router.navigate(['/']);
          return false;
        }
      })
    );
    
  }
}
