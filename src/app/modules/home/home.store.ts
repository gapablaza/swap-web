import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { catchError, EMPTY, exhaustMap, tap } from 'rxjs';

import { Collection, SearchService, User } from 'src/app/core';

export interface HomeState {
  added: Collection[];
  moreItems: User[];
  moreMedia: User[];
  morePositives: User[];
  popular: Collection[];
  published: Collection[];
  users: User[];

  isLoaded: boolean;
}

@Injectable()
export class HomeStore extends ComponentStore<HomeState> {
  constructor(private searchSrv: SearchService) {
    super({
      added: [],
      moreItems: [],
      moreMedia: [],
      morePositives: [],
      popular: [],
      published: [],
      users: [],

      isLoaded: false,
    });
  }

  readonly fetchData = this.effect<void>((trigger$) =>
    trigger$.pipe(
      exhaustMap(() =>
        this.searchSrv.getHomeData().pipe(
          tap({
            next: (data) => this.load({ ...data, isLoaded: true }),
            error: (error) => {
              console.log(error);
              this.patchState({ isLoaded: true });
            },
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

  readonly load = this.updater((state, data: HomeState) => ({
    ...state,
    added: data.added,
    moreItems: data.moreItems,
    moreMedia: data.moreMedia,
    morePositives: data.morePositives,
    popular: data.popular,
    published: data.published,
    users: data.users,
    isLoaded: data.isLoaded,
  }));

  readonly added$ = this.select((state) => state.added.sort((a, b) => {
    return a.id < b.id ? 1 : -1;
  }));
  readonly moreItems$ = this.select((state) => state.moreItems.sort((a, b) => {
    return (a.totalItems || 0) < (b.totalItems || 0) ? 1 : -1;
  }));
  readonly moreMedia$ = this.select((state) => state.moreMedia.sort((a, b) => {
    return (a.contributions || 0) < (b.contributions || 0) ? 1 : -1;
  }));
  readonly morePositives$ = this.select((state) => state.morePositives.sort((a, b) => {
    return (a.userSummary?.positives || 0) < (b.userSummary?.positives || 0) ? 1 : -1;
  }));
  readonly popular$ = this.select((state) => state.popular.sort((a, b) => {
    return (a.recentCollecting || 0) < (b.recentCollecting || 0) ? 1 : -1;
  }));
  readonly published$ = this.select((state) => state.published.sort((a, b) => {
    return a.release < b.release ? 1 : -1;
  }));
  readonly users$ = this.select((state) => state.users.sort((a, b) => {
    return a.id < b.id ? 1 : -1;
  }));

  readonly vm$ = this.select(
    {
      added: this.added$,
      moreItems: this.moreItems$,
      moreMedia: this.moreMedia$,
      morePositives: this.morePositives$,
      popular: this.popular$,
      published: this.published$,
      users: this.users$,
    },
    { debounce: true }
  );
}
