import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import {
  catchError,
  EMPTY,
  exhaustMap,
  filter,
  tap,
  withLatestFrom,
} from 'rxjs';

import {
  Collection,
  Pagination,
  Publisher,
  PublisherService,
  SearchService,
} from 'src/app/core';

export interface RouteParamsPaginationState {
  page?: string;
  sortBy?: string;
  publisher?: string;
}

export interface ExploreCollectionsState {
  collections: Collection[];
  publishers: Publisher[];

  pageSelected: number;
  sortOptionSelected: string;
  publisherSelected: number | undefined;

  paginator: Pagination;
  isLoaded: boolean;
}

export const initialState: ExploreCollectionsState = {
  collections: [],
  publishers: [],

  pageSelected: 1,
  sortOptionSelected: 'published-DESC',
  publisherSelected: undefined,

  paginator: {} as Pagination,
  isLoaded: false,
};

@Injectable()
export class ExploreCollectionsStore extends ComponentStore<ExploreCollectionsState> {
  constructor(
    private searchSrv: SearchService,
    private pubSrv: PublisherService
  ) {
    super(initialState);
  }

  readonly fetchCollections = this.effect<void>((trigger$) =>
    trigger$.pipe(
      withLatestFrom(
        this.select((state) => state.pageSelected),
        this.select((state) => state.sortOptionSelected),
        this.select((state) => state.publisherSelected)
      ),
      tap(() => this.setLoading()),
      exhaustMap(([, page, sortBy, publisher]) =>
        this.searchSrv
          .exploreCollections({
            page,
            sortBy,
            ...(publisher && { publisher }),
          })
          .pipe(
            tap({
              next: ({ paginator, collections }) =>
                this.loadCollections({ paginator, collections }),
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

  readonly fetchPublishers = this.effect<void>((trigger$) =>
    trigger$.pipe(
      withLatestFrom(this.select((state) => state.publishers)),
      filter(([, publishers]) => publishers.length === 0),
      exhaustMap(() =>
        this.pubSrv.list().pipe(
          tap({
            next: (publishers) => this.loadPublishers({ publishers }),
            error: (error) => {
              console.log(error);
            },
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

  readonly loadCollections = this.updater(
    (state, data: { paginator: Pagination; collections: Collection[] }) => ({
      ...state,
      collections: [...data.collections],
      pageSelected: data.paginator.current_page,
      paginator: data.paginator,
      isLoaded: true,
    })
  );

  readonly loadPublishers = this.updater(
    (state, data: { publishers: Publisher[] }) => ({
      ...state,
      publishers: [...data.publishers],
    })
  );

  readonly setLoading = this.updater((state) => ({
    ...state,
    isLoaded: false,
  }));

  readonly setPaginationParams = this.updater(
    (state, params: RouteParamsPaginationState) => {
      let pageSelected =
        params.page === undefined
          ? initialState.pageSelected
          : parseInt(params.page);
      let sortOptionSelected =
        params.sortBy === undefined
          ? initialState.sortOptionSelected
          : params.sortBy;
      let publisherSelected =
        params.publisher === undefined
          ? initialState.publisherSelected
          : parseInt(params.publisher);

    //       // https://stackoverflow.com/a/24457420
    //       if (page && /^\d+$/.test(page)) {
    //         this.pageSelected = parseInt(page);
    //       }

    //       if (
    //         sortBy &&
    //         this.sortOptions.find((item) => item.selectValue == sortBy)
    //       ) {
    //         this.sortOptionSelected = sortBy;
    //       }

    //       if (publisher && /^\d+$/.test(publisher)) {
    //         this.publisherSelected = parseInt(publisher);
    //         this.isFiltered = true;
    //       } else {
    //         this.publisherSelected = undefined;
    //         this.isFiltered = false;
    //       }

      return {
        ...state,
        pageSelected,
        sortOptionSelected,
        publisherSelected,
      };
    }
  );

  readonly collections$ = this.select((state) => state.collections);
  readonly publishers$ = this.select((state) =>
    state.publishers.sort((a, b) => {
      return (a.name || '').toLocaleLowerCase() >
        (b.name || '').toLocaleLowerCase()
        ? 1
        : -1;
    })
  );

  readonly pageSelected$ = this.select((state) => state.pageSelected);
  readonly sortOptionSelected$ = this.select(
    (state) => state.sortOptionSelected
  );
  readonly publisherSelected$ = this.select((state) => state.publisherSelected);

  readonly paginator$ = this.select((state) => state.paginator);
  readonly isLoaded$ = this.select((state) => state.isLoaded);

  readonly isFiltered$ = this.select(
    this.publisherSelected$,
    (publisher) => publisher !== undefined
  );
  readonly vm$ = this.select(
    {
      collections: this.collections$,
      publisherSelected: this.publisherSelected$,
      isFiltered: this.isFiltered$,
      sortOptionSelected: this.sortOptionSelected$,
      pageSelected: this.pageSelected$,
      paginator: this.paginator$,
    },
    { debounce: true }
  );
}
