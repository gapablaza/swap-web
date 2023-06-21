import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { filter, map, take } from 'rxjs';

import { AuthService } from 'src/app/core';
import { UIService } from 'src/app/shared';

@Injectable()
export class LocationGuard  {
  constructor(
    private router: Router,
    private authSrv: AuthService,
    private uiSrv: UIService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authSrv.authUser.pipe(
      filter(user => user.id != null),
      take(1),
      map((user) => {
        if (user.location_city) {
          return true;
        } else {
          this.uiSrv.showError(
            'Debes indicar tu ubicación para poder proponerte posibles cambios!'
          );
          this.router.navigate(['/settings']);
          return false;
        }
      })
    );
  }
}
