import { Component, effect, OnDestroy, OnInit } from '@angular/core';
import {
  registerLocaleData,
  NgClass,
  DecimalPipe,
  AsyncPipe,
} from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import es from '@angular/common/locales/es';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { SlugifyPipe } from '../../shared/pipes/slugify.pipe';
import { DaysSinceLoginDirective } from '../../shared/directives/days-since-login.directive';
import { DEFAULT_COLLECTION_IMG, DEFAULT_USER_PROFILE_IMG } from 'src/app/core';
import { authFeature } from '../auth/store/auth.state';
import { TradesStore } from './trades.store';
import { TradesResolver } from './trades-resolver.service';
import { TradesItemComponent } from './trades-item.component';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';
import { AdLoaderComponent } from 'src/app/shared/components/ad-loader/ad-loader.component';

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
    RouterLink,
    NgClass,
    FormsModule,
    AsyncPipe,
    DecimalPipe,

    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatSelectModule,

    LazyLoadImageModule,
    SlugifyPipe,
    DaysSinceLoginDirective,
    TradesItemComponent,
    PaginationComponent,
    AdLoaderComponent,
  ],
  providers: [TradesResolver, TradesStore],
})
export class TradesComponent implements OnInit, OnDestroy {
  authUser$ = this.store.select(authFeature.selectUser);
  vm$ = this.tradesStore.vm$; // signal
  incompleteCollections$ = this.tradesStore.incompleteCollections$;
  isLoaded$ = this.tradesStore.isLoaded$;

  subs: Subscription = new Subscription();

  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  defaultCollectionImage = DEFAULT_COLLECTION_IMG;

  defaultLastSeen = '7';
  defaultFrom = '2';
  defaultCollections = '';

  selectedLastSeen!: string;
  selectedFrom!: string;
  selectedCollections!: string;

  constructor(
    private tradesStore: TradesStore,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute
  ) {
    effect(() => {
      this.selectedLastSeen = this.tradesStore.vm$().daysSelected.toString();
      this.selectedFrom = this.tradesStore.vm$().locationSelected.toString();
      this.selectedCollections = this.tradesStore.vm$().collectionsSelected;
    });
  }

  ngOnInit(): void {
    registerLocaleData(es);
    this.tradesStore.loadCollections(
      this.route.snapshot.data['incompleteCollections']
    );

    // process pagination params
    let routeSub = this.route.queryParams.subscribe((routeParams) => {
      this.tradesStore.setPaginationParams(routeParams);
      this.tradesStore.fetch();
    });
    this.subs.add(routeSub);
  }

  onPageChange(e: number) {
    let queryParams = { ...this.route.snapshot.queryParams };
    queryParams['page'] = e;

    this.router.navigate(['/trades'], {
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  onSearchTrades() {
    this.router.navigate(['/trades'], {
      queryParams: this.getFilters(),
    });
  }

  getFilters(): IFilters {
    let filters = {} as IFilters;

    // si lastSeen no tiene el valor por defecto, o ha cambiado, asignamos el nuevo valor
    if (
      this.selectedLastSeen != this.defaultLastSeen ||
      this.selectedLastSeen != this.tradesStore.vm$().daysSelected.toString()
    ) {
      filters.days = parseInt(this.selectedLastSeen);
    }
    // si from no tiene el valor por defecto, o ha cambiado, asignamos el nuevo valor
    if (
      this.selectedFrom != this.defaultFrom ||
      this.selectedFrom != this.tradesStore.vm$().locationSelected.toString()
    ) {
      filters.location = parseInt(this.selectedFrom);
    }

    // si collections no tiene el valor por defecto, o ha cambiado, asignamos el nuevo valor
    if (
      this.selectedCollections != this.defaultCollections ||
      this.selectedCollections != this.tradesStore.vm$().collectionsSelected
    ) {
      if (this.selectedCollections)
        filters.collections = this.selectedCollections;
    }

    // console.log(filters);
    return filters;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
