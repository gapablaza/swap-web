import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable } from 'rxjs';

import { ItemService, User } from 'src/app/core';

@Injectable({
  providedIn: 'root',
})
export class ItemResolver  {
  constructor(private itemSrv: ItemService, private router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.itemSrv
      .get(Number(route.params['id']))
      .pipe(catchError((err) => this.router.navigateByUrl('/')));
  }
}
