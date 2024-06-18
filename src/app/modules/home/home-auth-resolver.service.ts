import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { authFeature } from '../auth/store/auth.state';

@Injectable({
  providedIn: 'root',
})
export class HomeAuthResolver {
  constructor(private store: Store) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.store.select(authFeature.selectIsAuth).pipe(take(1));
  }
}
