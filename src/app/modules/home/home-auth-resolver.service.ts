import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/core';

@Injectable({
  providedIn: 'root',
})
export class HomeAuthResolver  {
  constructor(private router: Router, private authSrv: AuthService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authSrv.isAuth.pipe(take(1));
  }
}
