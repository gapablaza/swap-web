import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, filter, take, tap } from 'rxjs';

import { userFeature } from './store/user.state';

export const userGuard = (): Observable<boolean> => {
  const store = inject(Store);
  console.log('userGuard');

  return store.select(userFeature.selectIsLoaded).pipe(
    filter((loaded) => loaded),
    tap(() => console.log('userGuard post filter')),
    take(1)
  );
};
