import { Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ComponentStore } from '@ngrx/component-store';
import { catchError, EMPTY, exhaustMap, tap, withLatestFrom } from 'rxjs';

import { Collection, Pagination, Trades, UserService } from 'src/app/core';

export interface RouteParamsPaginationState {
  page?: string;
  days?: string;
  location?: string;
  collections?: string;
}

export interface TradesState {
  trades: Trades;
  incompleteCollections: Collection[];

  pageSelected: number;
  daysSelected: number;
  locationSelected: number;
  collectionsSelected: string;

  paginator: Pagination;
  isLoaded: boolean;
}

export const initialState: TradesState = {
  trades: {} as Trades,
  incompleteCollections: [],

  pageSelected: 1,
  daysSelected: 7,
  locationSelected: 2,
  collectionsSelected: '',

  paginator: {} as Pagination,
  isLoaded: false,
};

@Injectable()
export class TradesStore extends ComponentStore<TradesState> {
  constructor(private userSrv: UserService) {
    super(initialState);
  }

  readonly fetch = this.effect<void>((trigger$) =>
    trigger$.pipe(
      withLatestFrom(
        this.select((state) => state.pageSelected),
        this.select((state) => state.daysSelected),
        this.select((state) => state.locationSelected),
        this.select((state) => state.collectionsSelected)
      ),
      tap(() => this.setLoading()),
      exhaustMap(([, page, days, location, collections]) =>
        this.userSrv.getTrades({ page, days, location, collections }).pipe(
          tap({
            next: (trades) => this.loadTrades(trades),
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

  readonly loadCollections = this.updater(
    (state, collections: Collection[]) => ({
      ...state,
      incompleteCollections: [...collections],
    })
  );

  readonly loadTrades = this.updater((state, trades: Trades) => {
    let pageSelected = initialState.pageSelected;
    let paginator = {} as Pagination;
    if (typeof trades.paginate != 'boolean') {
      paginator = trades.paginate;
      pageSelected = trades.paginate.current_page;
    }
    return {
      ...state,
      trades,
      paginator,
      pageSelected,
      isLoaded: true,
    };
  });

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
      let daysSelected =
        params.days === undefined
          ? initialState.daysSelected
          : parseInt(params.days);
      let locationSelected =
        params.location === undefined
          ? initialState.locationSelected
          : parseInt(params.location);
      let collectionsSelected =
        params.collections === undefined
          ? initialState.collectionsSelected
          : params.collections;

      //   // https://stackoverflow.com/a/24457420
      //   if (days && /^\d+$/.test(days)) {
      //     this.usersLastSeenSelected = days;
      //   } else {
      //     this.usersLastSeenSelected = '7';
      //   }

      //   if (location && /^\d+$/.test(location)) {
      //     this.usersFromSelected = location;
      //   } else {
      //     this.usersFromSelected = '2';
      //   }

      //   if (page && /^\d+$/.test(page)) {
      //     this.pageSelected = parseInt(page);
      //   } else {
      //     this.pageSelected = 1;
      //   }

      //   if (collections) {
      //     this.userCollectionsSelected = collections;
      //   } else {
      //     this.userCollectionsSelected = '';
      //   }

      return {
        ...state,
        pageSelected,
        daysSelected,
        locationSelected,
        collectionsSelected,
      };
    }
  );

  readonly trades$ = this.select((state) => state.trades);
  readonly incompleteCollections$ = this.select(
    (state) => state.incompleteCollections
  );

  readonly pageSelected$ = this.select((state) => state.pageSelected);
  readonly daysSelected$ = this.select((state) => state.daysSelected);
  readonly locationSelected$ = this.select((state) => state.locationSelected);
  readonly collectionsSelected$ = this.select(
    (state) => state.collectionsSelected
  );

  readonly paginator$ = this.select((state) => state.paginator);
  readonly isLoaded$ = this.select((state) => state.isLoaded);

  readonly vm$ = toSignal(
    this.select(
      {
        trades: this.trades$,
        incompleteCollections: this.incompleteCollections$,
        pageSelected: this.pageSelected$,
        daysSelected: this.daysSelected$,
        locationSelected: this.locationSelected$,
        collectionsSelected: this.collectionsSelected$,
        paginator: this.paginator$,
      },
      { debounce: true }
    ),
    {
      initialValue: initialState,
    }
  );
}
