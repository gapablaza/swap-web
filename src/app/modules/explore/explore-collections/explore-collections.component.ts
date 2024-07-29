import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  registerLocaleData,
  DecimalPipe,
  NgClass,
  AsyncPipe,
} from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import es from '@angular/common/locales/es';
import { Subscription, tap } from 'rxjs';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SEOService } from 'src/app/core';
import { CollectionItemComponent } from '../../../shared/components/collection-item/collection-item.component';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';
import { ExploreCollectionsStore } from './explore-collections.store';
import { AdLoaderComponent } from 'src/app/shared/components/ad-loader/ad-loader.component';

@Component({
  selector: 'app-explore-collections',
  templateUrl: './explore-collections.component.html',
  standalone: true,
  providers: [ExploreCollectionsStore],
  imports: [
    FormsModule,
    NgClass,
    AsyncPipe,
    DecimalPipe,

    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatSelectModule,

    AdLoaderComponent,
    CollectionItemComponent,
    PaginationComponent,
  ],
})
export class ExploreCollectionsComponent implements OnInit, OnDestroy {
  vm$ = this.exploreStore.vm$;
  publishers$ = this.exploreStore.publishers$;
  isLoaded$ = this.exploreStore.isLoaded$;

  showFilters = false;
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

  subs: Subscription = new Subscription();

  constructor(
    private exploreStore: ExploreCollectionsStore,
    private router: Router,
    private route: ActivatedRoute,
    private SEOSrv: SEOService
  ) {}

  ngOnInit(): void {
    registerLocaleData(es);
    this.exploreStore.fetchPublishers();

    const routeSub = this.route.queryParams
      .pipe(
        tap(() => {
          this.SEOSrv.set({
            title: 'Explorar Colecciones - Intercambia Láminas',
            description:
              'Revisa el listado completo de colecciones que tenemos disponible, marca tus repetidas/faltantes y encuentra con quién intercambiar!',
            isCanonical: false,
          });
        })
      )
      .subscribe((routeParams) => {
        this.exploreStore.setPaginationParams(routeParams);
        this.exploreStore.fetchCollections();
      });
    this.subs.add(routeSub);
  }

  onRoute(queryParams: Params) {
    this.router.navigate(['/collections'], {
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  onSort(selectedValue: string) {
    const queryParams = { ...this.route.snapshot.queryParams };
    queryParams['page'] = 1;
    queryParams['sortBy'] = selectedValue;

    this.onRoute(queryParams);
  }

  onPublisherChanged(selectedValue: string) {
    const queryParams = { ...this.route.snapshot.queryParams };
    queryParams['page'] = 1;
    queryParams['publisher'] = selectedValue;

    this.onRoute(queryParams);
  }

  onPageChange(e: string) {
    const pageSelected = parseInt(e);
    const queryParams = { ...this.route.snapshot.queryParams };
    queryParams['page'] = pageSelected;

    this.onRoute(queryParams);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
