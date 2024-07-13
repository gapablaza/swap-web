import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  registerLocaleData,
  NgIf,
  NgFor,
  DecimalPipe,
  NgClass,
} from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import es from '@angular/common/locales/es';
import { filter, Subscription, switchMap, take, tap } from 'rxjs';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AdsModule } from 'src/app/shared/ads.module';
import { UIService } from 'src/app/shared';
import {
  AuthService,
  Collection,
  DEFAULT_COLLECTION_IMG,
  Pagination,
  Publisher,
  PublisherService,
  SearchService,
  SEOService,
  User,
} from 'src/app/core';
import { CollectionItemComponent } from '../../../shared/components/collection-item/collection-item.component';

@Component({
  selector: 'app-explore-collections',
  templateUrl: './explore-collections.component.html',
  standalone: true,
  imports: [
    NgIf,
    MatProgressSpinnerModule,
    AdsModule,
    MatFormFieldModule,
    MatSelectModule,
    NgFor,
    NgClass,
    MatOptionModule,
    CollectionItemComponent,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    DecimalPipe,
  ],
})
export class ExploreCollectionsComponent implements OnInit, OnDestroy {
  collections: Collection[] = [];
  publishers: Publisher[] = [];
  authUser: User = {} as User;
  paginator: Pagination = {} as Pagination;
  defaultCollectionImage = DEFAULT_COLLECTION_IMG;

  sortOptionSelected = 'published-DESC';
  sortOptions = [
    {
      selectName: 'Últimos publicados',
      selectValue: 'published-DESC',
      arrayFields: ['year', 'release'],
      arrayOrders: ['desc', 'desc'],
    },
    {
      selectName: 'Más antiguos',
      selectValue: 'published-ASC',
      arrayFields: ['year', 'release'],
      arrayOrders: ['asc', 'asc'],
    },
    {
      selectName: 'Nombre A-Z',
      selectValue: 'title-ASC',
      arrayFields: ['name', 'release'],
      arrayOrders: ['asc', 'asc'],
    },
    {
      selectName: 'Nombre Z-A',
      selectValue: 'title-DESC',
      arrayFields: ['name', 'release'],
      arrayOrders: ['desc', 'desc'],
    },
  ];
  pageSelected = 1;
  publisherSelected: number | undefined = undefined;
  showFilters = false;
  isFiltered = false;

  isAdsLoaded = false;
  isLoaded = false;
  subs: Subscription = new Subscription();

  constructor(
    private searchSrv: SearchService,
    private pubSrv: PublisherService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
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

    // process pagination params
    this.activatedRoute.queryParamMap
      .pipe(
        tap(() => {
          this.SEOSrv.set({
            title: 'Explorar Colecciones - Intercambia Láminas',
            description:
              'Revisa el listado completo de colecciones que tenemos disponible, marca tus repetidas/faltantes y encuentra con quién intercambiar!',
            isCanonical: true,
          });
        }),
        switchMap((paramMap) => {
          this.isLoaded = false;
          const page = paramMap.get('page');
          const sortBy = paramMap.get('sortBy');
          const publisher = paramMap.get('publisher');

          // https://stackoverflow.com/a/24457420
          if (page && /^\d+$/.test(page)) {
            this.pageSelected = parseInt(page);
          }

          if (
            sortBy &&
            this.sortOptions.find((item) => item.selectValue == sortBy)
          ) {
            this.sortOptionSelected = sortBy;
          }

          if (publisher && /^\d+$/.test(publisher)) {
            this.publisherSelected = parseInt(publisher);
            this.isFiltered = true;
          } else {
            this.publisherSelected = undefined;
            this.isFiltered = false;
          }

          return this.searchSrv
            .exploreCollections({
              page: this.pageSelected,
              sortBy: this.sortOptionSelected,
              ...(this.publisherSelected && {
                publisher: this.publisherSelected,
              }),
            })
            .pipe(take(1));
        })
      )
      .subscribe((data) => {
        this.collections = data.collections;
        this.paginator = data.paginator;
        this.isLoaded = true;
      });

    // obtiene las editoriales
    let pubsSub = this.pubSrv
      .list()
      .pipe(take(1))
      .subscribe((pubs) => {
        this.publishers = pubs.sort((a, b) => {
          return (a.name || '').toLocaleLowerCase() >
            (b.name || '').toLocaleLowerCase()
            ? 1
            : -1;
        });
      });
    this.subs.add(pubsSub);
  }

  loadAds() {
    this.uiSrv.loadAds().then(() => {
      this.isAdsLoaded = true;
    });
  }

  onSort() {
    this.pageSelected = 1;
    this.router.navigate(['/collections'], {
      queryParams: {
        // page: this.pageSelected,
        sortBy: this.sortOptionSelected,
        ...(this.publisherSelected && { publisher: this.publisherSelected }),
      },
    });
  }

  onPublisherChanged() {
    console.log(this.publisherSelected);
    this.onSort();
  }

  onPageChange(e: string) {
    this.pageSelected = parseInt(e);
    this.router.navigate(['/collections'], {
      queryParams: {
        page: this.pageSelected,
        sortBy: this.sortOptionSelected,
        ...(this.publisherSelected && { publisher: this.publisherSelected }),
      },
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
