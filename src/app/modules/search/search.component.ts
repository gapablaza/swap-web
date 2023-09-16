import { registerLocaleData, NgIf } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  catchError,
  filter,
  of,
  Subscription,
  switchMap,
  take,
  tap,
} from 'rxjs';

import {
  AuthService,
  Collection,
  Pagination,
  SearchService,
  SEOService,
  User,
} from 'src/app/core';
import { UIService } from 'src/app/shared';
import { SearchUserComponent } from './search-user/search-user.component';
import { SearchCollectionComponent } from './search-collection/search-collection.component';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdsModule } from 'src/app/shared/ads.module';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        MatProgressSpinnerModule,
        FormsModule,
        AdsModule,
        MatTabsModule,
        SearchCollectionComponent,
        SearchUserComponent,
    ],
})
export class SearchComponent implements OnInit, OnDestroy {
  users: User[] = [];
  authUser: User = {} as User;
  collections: Collection[] = [];
  paginator: Pagination = {} as Pagination;
  tabsRoute = ['collection', 'user', 'publisher'];
  selectedTabIndex = 0;
  pageSelected = 1;
  ordersOptions = ['relevance', 'published-DESC', 'published-ASC', 'title-ASC', 'title-DESC'];
  orderSelected = 'relevance';

  searchedTxt = '';
  searchTxt = '';

  showSerchHint = false;
  isAdsLoaded = false;
  isLoaded = false;
  subs: Subscription = new Subscription();

  constructor(
    private searchSrv: SearchService,
    private route: ActivatedRoute,
    private router: Router,
    private authSrv: AuthService,
    private SEOSrv: SEOService,
    private uiSrv: UIService
  ) {}

  ngOnInit(): void {
    registerLocaleData(es);

    // get possible auth User
    let authSub = this.authSrv.authUser
      .pipe(
        tap((user) => {
          if (!user.id || user.accountTypeId == 1) {
            this.loadAds();
          }
        }),
        filter((user) => user.id != null)
      )
      .subscribe((user) => {
        this.authUser = user;
      });
    this.subs.add(authSub);

    this.route.queryParamMap
      .pipe(
        tap((params) => {
          this.SEOSrv.set({
            title: 'Resultado búsqueda - Intercambia Láminas',
            description:
              'Busca colecciones y usuarios registrados en nuestro catálogo',
            isCanonical: true,
          });

          // inicializa variables
          this.isLoaded = false;
          this.showSerchHint = false;
          this.searchedTxt = '';
          this.pageSelected = 1;
          this.orderSelected = 'relevance';
          this.users = [];
          this.collections = [];
          this.paginator = {} as Pagination;

          // obtiene posibles parámetros
          const query = params.get('q');
          const page = params.get('page');
          const type = params.get('type');
          const sortBy = params.get('sortBy');

          if (query && query.trim().length >= 2) {
            this.searchTxt = query.trim();
            this.searchedTxt = query.trim();
          }

          // https://stackoverflow.com/a/24457420
          if (page && /^\d+$/.test(page)) {
            this.pageSelected = parseInt(page);
          }

          let tempIndex = this.tabsRoute.findIndex((route) => route == type);
          this.selectedTabIndex = tempIndex >= 0 ? tempIndex : 0;

          let tempOrder = this.ordersOptions.findIndex(
            (order) => order == sortBy
          );
          this.orderSelected =
            tempOrder >= 0 ? this.ordersOptions[tempOrder] : 'relevance';
        }),
        filter((params) => {
          if ((params.get('q') || '').trim().length >= 2) {
            return true;
          } else {
            this.showSerchHint = true;
            this.isLoaded = true;
            return false;
          }
        }),
        switchMap((params) => {
          return this.searchSrv
            .search({
              query: this.searchedTxt,
              page: this.pageSelected,
              type: this.tabsRoute[this.selectedTabIndex],
              sortBy: this.orderSelected,
            })
            .pipe(
              catchError((error) => {
                if (error.error && error.error.message) {
                  this.uiSrv.showError(error.error.message);
                }
                return of({
                  collections: [] as Collection[],
                  users: [] as User[],
                  paginator: {} as Pagination,
                });
              }),
              take(1)
            );
        })
      )
      .subscribe({
        next: (result) => {
          this.collections = result.collections;
          this.users = result.users;
          this.paginator = result.paginator;
          this.isLoaded = true;
        },
        error: (err) => {
          console.log(err);
          this.isLoaded = true;
        },
      });
  }

  loadAds() {
    this.uiSrv.loadAds().then(() => {
      this.isAdsLoaded = true;
    });
  }

  onSearch() {
    if (this.searchTxt.trim().length < 2) {
      this.uiSrv.showSnackbar('Debes ingresar al menos 2 caracteres');
      return;
    }

    let actualParams = this.route.snapshot.queryParams;

    this.router.navigate(['/search'], {
      relativeTo: this.route,
      queryParams: {
        ...actualParams,
        q: this.searchTxt,
        page: null,
      },
      queryParamsHandling: 'merge',
    });
  }

  onTabChanged($event: any) {
    let actualParams = this.route.snapshot.queryParams;

    this.router.navigate(['/search'], {
      relativeTo: this.route,
      queryParams: {
        ...actualParams,
        type: this.tabsRoute[$event.index],
        page: null,
      },
      queryParamsHandling: 'merge',
    });
  }

  onPageChanged($event: number) {
    let actualParams = this.route.snapshot.queryParams;

    this.router.navigate(['/search'], {
      relativeTo: this.route,
      queryParams: {
        ...actualParams,
        page: $event,
      },
    });
  }

  onOrderChanged($event: string) {
    let actualParams = this.route.snapshot.queryParams;

    this.router.navigate(['/search'], {
      relativeTo: this.route,
      queryParams: {
        ...actualParams,
        sortBy: $event,
      },
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
