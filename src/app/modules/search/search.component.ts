import { AsyncPipe, registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SEOService } from 'src/app/core';
import { UIService } from 'src/app/shared';
import { SearchUserComponent } from './search-user/search-user.component';
import { SearchCollectionComponent } from './search-collection/search-collection.component';
import { SearchStore } from './search.store';
import { AdLoaderComponent } from 'src/app/shared/components/ad-loader/ad-loader.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  standalone: true,
  providers: [SearchStore],
  imports: [
    FormsModule,
    AsyncPipe,

    MatProgressSpinnerModule,
    MatTabsModule,

    AdLoaderComponent,
    SearchUserComponent,
    SearchCollectionComponent,
  ],
})
export class SearchComponent implements OnInit, OnDestroy {
  vm$ = this.searchStore.vm$; // signal
  showResults$ = this.searchStore.showResults$;
  isLoaded$ = this.searchStore.isLoaded$;

  tabsRoute = ['collection', 'user'];
  selectedTabIndex = 0;
  searchTxt = '';
  subs: Subscription = new Subscription();

  constructor(
    private searchStore: SearchStore,
    private router: Router,
    private route: ActivatedRoute,
    private SEOSrv: SEOService,
    private uiSrv: UIService
  ) {}

  ngOnInit(): void {
    registerLocaleData(es);

    let routeSub = this.route.queryParams
      .pipe(
        tap((params) => {
          this.SEOSrv.set({
            title: 'Resultado búsqueda - Intercambia Láminas',
            description:
              'Busca colecciones y usuarios registrados en nuestro catálogo',
            isCanonical: false,
          });

          let tempIndex = this.tabsRoute.findIndex(
            (route) => route == params['type']
          );
          this.selectedTabIndex = tempIndex >= 0 ? tempIndex : 0;

          const query = params['q'];
          if (query && query.trim().length >= 2) {
            this.searchTxt = query.trim();
          }

          // let tempOrder = this.ordersOptions.findIndex(
          //   (order) => order == sortBy
          // );
          // this.orderSelected =
          //   tempOrder >= 0 ? this.ordersOptions[tempOrder] : 'relevance';
        })
      )
      .subscribe((routeParams) => {
        this.searchStore.setPaginationParams(routeParams);
        this.searchStore.fetch();
      });
    this.subs.add(routeSub);
  }

  onRoute(queryParams: Params) {
    this.router.navigate(['/search'], {
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  onSearch() {
    if (this.searchTxt.trim().length < 2) {
      this.uiSrv.showSnackbar('Debes ingresar al menos 2 caracteres');
      return;
    }

    let queryParams = { ...this.route.snapshot.queryParams };
    queryParams['q'] = this.searchTxt;
    queryParams['page'] = null;

    this.onRoute(queryParams);
  }

  onTabChanged($event: any) {
    let queryParams = { ...this.route.snapshot.queryParams };
    queryParams['type'] = this.tabsRoute[$event.index];
    queryParams['page'] = null;

    this.onRoute(queryParams);
  }

  onPageChanged($event: number) {
    let queryParams = { ...this.route.snapshot.queryParams };
    queryParams['page'] = $event;

    this.onRoute(queryParams);
  }

  onOrderChanged($event: string) {
    let queryParams = { ...this.route.snapshot.queryParams };
    queryParams['sortBy'] = $event;
    queryParams['page'] = null;

    this.onRoute(queryParams);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
