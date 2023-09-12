import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable } from 'rxjs';

import { CollectionService } from 'src/app/core';

@Injectable({
  providedIn: 'root',
})
export class CollectionResolver  {
  constructor(private colSrv: CollectionService, private router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.colSrv
      .get(Number(route.params['id']))
      .pipe(
        catchError((err) => this.router.navigateByUrl('/')),
      );
  }
}
