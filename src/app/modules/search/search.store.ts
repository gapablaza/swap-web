import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import {
  catchError,
  EMPTY,
  exhaustMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { Collection, Pagination, SearchService, User } from 'src/app/core';

export interface RouteParamsPaginationState {
  page?: string;
  sortBy?: string;
  type?: string;
  q?: string;
}

export interface SearchState {
  collections: Collection[];
  users: User[];

  pageSelected: number;
  sortOptionSelected: string;
  typeSelected: string;
  query: string;

  paginator: Pagination;
  isLoaded: boolean;
}

export const initialState: SearchState = {
  collections: [],
  users: [],

  pageSelected: 1,
  sortOptionSelected: 'relevance',
  typeSelected: 'collection',
  query: '',

  paginator: {} as Pagination,
  isLoaded: false,
};

@Injectable()
export class SearchStore extends ComponentStore<SearchState> {
  constructor(private searchSrv: SearchService) {
    super(initialState);
  }

  readonly fetch = this.effect<void>((trigger$) =>
    trigger$.pipe(
      withLatestFrom(
        this.select((state) => state.pageSelected),
        this.select((state) => state.sortOptionSelected),
        this.select((state) => state.typeSelected),
        this.select((state) => state.query)
      ),
      tap(() => this.setLoading()),
      exhaustMap(([, page, sortBy, type, query]) => {
        if (query.trim() == '') {
          this.patchState({ isLoaded: true });
          return EMPTY;
        }

        return this.searchSrv
        .search({
          query,
          page,
          type,
          sortBy,
          // ...(publisher && { publisher }),
        })
        .pipe(
          tap({
            next: ({ collections, users, paginator }) =>
              this.load({ collections, users, paginator }),
            error: (error) => {
              console.log(error);
              this.patchState({ isLoaded: true });
            },
          }),
          catchError(() => EMPTY)
        )
      }
        
      )
    )
  );

  readonly load = this.updater(
    (
      state,
      data: { collections: Collection[]; users: User[]; paginator: Pagination }
    ) => ({
      ...state,
      collections: [...data.collections],
      users: [...data.users],
      pageSelected: data.paginator.current_page,
      paginator: data.paginator,
      isLoaded: true,
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
      let typeSelected =
        params.type === undefined ? initialState.typeSelected : params.type;
      let query = params.q === undefined ? initialState.query : params.q;

      // if (query && query.trim().length >= 2) {
      //     this.searchTxt = query.trim();
      //     this.searchedTxt = query.trim();
      //   }

      //   // https://stackoverflow.com/a/24457420
      //   if (page && /^\d+$/.test(page)) {
      //     this.pageSelected = parseInt(page);
      //   }

      //   let tempIndex = this.tabsRoute.findIndex((route) => route == type);
      //   this.selectedTabIndex = tempIndex >= 0 ? tempIndex : 0;

      //   let tempOrder = this.ordersOptions.findIndex(
      //     (order) => order == sortBy
      //   );
      //   this.orderSelected =
      //     tempOrder >= 0 ? this.ordersOptions[tempOrder] : 'relevance';

      return {
        ...state,
        pageSelected,
        sortOptionSelected,
        typeSelected,
        query,
      };
    }
  );

  readonly collections$ = this.select((state) => state.collections);
  readonly users$ = this.select((state) => state.users);

  readonly pageSelected$ = this.select((state) => state.pageSelected);
  readonly sortOptionSelected$ = this.select(
    (state) => state.sortOptionSelected
  );
  readonly typeSelected$ = this.select((state) => state.typeSelected);
  readonly query$ = this.select((state) => state.query);

  readonly paginator$ = this.select((state) => state.paginator);
  readonly isLoaded$ = this.select((state) => state.isLoaded);

  readonly showResults$ = this.select(
    (state) => state.query.length >= 2 && state.isLoaded
  );

  readonly vm$ = toSignal(
    this.select(
      {
        collections: this.collections$,
        users: this.users$,
        pageSelected: this.pageSelected$,
        sortOptionSelected: this.sortOptionSelected$,
        typeSelected: this.typeSelected$,
        query: this.query$,
        paginator: this.paginator$,
      },
      { debounce: true }
    ),
    {
      initialValue: initialState,
    }
  );
}
