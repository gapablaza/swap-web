import { Component, OnInit } from '@angular/core';
import {
  registerLocaleData,
  NgClass,
  DecimalPipe,
  AsyncPipe,
} from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import es from '@angular/common/locales/es';
import { switchMap, tap } from 'rxjs';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AdsModule } from 'src/app/shared/ads.module';
import { UIService } from 'src/app/shared';
import { SlugifyPipe } from '../../shared/pipes/slugify.pipe';
import { DaysSinceLoginDirective } from '../../shared/directives/days-since-login.directive';
import {
  AuthService,
  Collection,
  DEFAULT_COLLECTION_IMG,
  DEFAULT_USER_PROFILE_IMG,
  Pagination,
  Trades,
  UserService,
} from 'src/app/core';
import { TradesResolver } from './trades-resolver.service';
import { authFeature } from '../auth/store/auth.state';
import { Store } from '@ngrx/store';

export interface IFilters {
  days?: number;
  location?: number;
  page?: number;
  collections?: string;
}

@Component({
  selector: 'app-trades',
  templateUrl: './trades.component.html',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    AdsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    NgClass,
    RouterLink,
    LazyLoadImageModule,
    DaysSinceLoginDirective,
    DecimalPipe,
    SlugifyPipe,
    AsyncPipe
  ],
  providers: [TradesResolver],
})
export class TradesComponent implements OnInit {
  // authUser: User = {} as User;
  // authUser = this.authSrv.getCurrentUser();
  authUser$ = this.store.select(authFeature.selectUser).pipe(
    tap(user => {
      if (user.accountTypeId == 1) {
        this.loadAds();
      }
    })
  );

  // incompleteCollections: Collection[] = [];
  incompleteCollections: Collection[] =
    this.activatedRoute.snapshot.data['incompleteCollections'];

  trades!: Trades;
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  defaultCollectionImage = DEFAULT_COLLECTION_IMG;
  paginator: Pagination = {} as Pagination;
  pageSelected = 1;

  usersLastSeenSelected = '7';
  usersFromSelected = '2';
  userCollectionsSelected = '';

  showFilters = false;
  isAdsLoaded = false;
  isLoaded = false;

  constructor(
    private authSrv: AuthService,
    private store: Store,
    private userSrv: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private uiSrv: UIService
  ) {}

  ngOnInit(): void {
    registerLocaleData(es);

    // this.authUser = this.authSrv.getCurrentUser();

    // this.activatedRoute.data.subscribe((data) => {
    //   this.incompleteCollections = data['incompleteCollections'];
    // });

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

    // if (this.authUser.accountTypeId == 1) {
    //   this.loadAds();
    // }


  }

  loadAds() {
    if (this.isAdsLoaded) return;

    this.uiSrv.loadAds().then(() => {
      this.isAdsLoaded = true;
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
