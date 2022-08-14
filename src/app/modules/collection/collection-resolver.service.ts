import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { catchError, Observable } from 'rxjs';

import { Collection, CollectionService } from 'src/app/core';

@Injectable({
  providedIn: 'root',
})
export class CollectionResolver implements Resolve<Collection> {
  constructor(private colSrv: CollectionService, private router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.colSrv
      .get(Number(route.params['id']))
      .pipe(catchError((err) => this.router.navigateByUrl('/')));
  }
}
