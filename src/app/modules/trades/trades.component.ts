import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';

import {
  AuthService,
  Collection,
  DEFAULT_COLLECTION_IMG,
  DEFAULT_USER_PROFILE_IMG,
  Pagination,
  Trades,
  UserService,
} from 'src/app/core';

export interface IFilters {
  days?: number;
  location?: number;
  page?: number;
  collections?: string;
}

@Component({
  selector: 'app-trades',
  templateUrl: './trades.component.html',
  styleUrls: ['./trades.component.scss'],
})
export class TradesComponent implements OnInit {
  // authUser: User = {} as User;
  authUser = this.authSrv.getCurrentUser();
  incompleteCollections: Collection[] = [];
  trades!: Trades;
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  defaultCollectionImage = DEFAULT_COLLECTION_IMG;
  paginator: Pagination = {} as Pagination;
  pageSelected = 1;

  usersLastSeenSelected = '7';
  usersFromSelected = '2';
  userCollectionsSelected = '';

  showFilters = false;
  isLoaded = false;

  constructor(
    private authSrv: AuthService,
    private userSrv: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    registerLocaleData(es);

    // this.authUser = this.authSrv.getCurrentUser();

    this.activatedRoute.data.subscribe((data) => {
      this.incompleteCollections = data['incompleteCollections'];
    });

    // process pagination params
    this.activatedRoute.queryParamMap
      .pipe(
        switchMap((paramMap) => {
          this.isLoaded = false;

          const days = paramMap.get('days');
          const location = paramMap.get('location');
          const page = paramMap.get('page');
          const collections = paramMap.get('collections');

          // https://stackoverflow.com/a/24457420
          if (days && /^\d+$/.test(days)) {
            this.usersLastSeenSelected = days;
          } else {
            this.usersLastSeenSelected = '7';
          }

          if (location && /^\d+$/.test(location)) {
            this.usersFromSelected = location;
          } else {
            this.usersFromSelected = '2';
          }

          if (page && /^\d+$/.test(page)) {
            this.pageSelected = parseInt(page);
          } else {
            this.pageSelected = 1;
          }

          if (collections) {
            this.userCollectionsSelected = collections;
          } else {
            this.userCollectionsSelected = '';
          }

          return this.userSrv.getTrades(this.getFilters());
        })
      )
      .subscribe((trades) => {
        this.trades = trades;
        if (typeof trades.paginate != 'boolean') {
          this.paginator = trades.paginate;
        }
        this.isLoaded = true;
      });
  }

  onPageChange(e: string) {
    this.pageSelected = parseInt(e);

    this.router.navigate(['/trades'], {
      queryParams: this.getFilters(),
    });
  }

  onSearchTrades() {
    this.router.navigate(['/trades'], {
      queryParams: this.getFilters(),
    });
  }

  getFilters(): IFilters {
    let filters = {} as IFilters;

    if (this.usersLastSeenSelected != '7') {
      filters.days = parseInt(this.usersLastSeenSelected);
    }
    if (this.usersFromSelected != '2') {
      filters.location = parseInt(this.usersFromSelected);
    }
    if (this.pageSelected != 1) {
      filters.page = this.pageSelected;
    }
    if (this.userCollectionsSelected != '') {
      filters.collections = this.userCollectionsSelected;
    }

    return filters;
  }
}
