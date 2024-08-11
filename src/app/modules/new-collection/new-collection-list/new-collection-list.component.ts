import { AsyncPipe, registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';

import { UIService } from 'src/app/shared';
import { LinebreaksPipe } from '../../../shared/pipes/linebreaks.pipe';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';
import { newCollectionFeature } from '../store/new-collection.state';
import { newCollectionActions } from '../store/new-collection.actions';

@Component({
  selector: 'app-new-collection-list',
  templateUrl: './new-collection-list.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    RouterLink,

    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatSelectModule,

    LinebreaksPipe,
    PaginationComponent,
  ],
})
export class NewCollectionListComponent implements OnInit, OnDestroy {
  newCollections$ = this.store.select(
    newCollectionFeature.selectNewCollections
  );
  paginator = this.store.selectSignal(newCollectionFeature.selectPaginator);
  routeParams = this.store.selectSignal(newCollectionFeature.selectRouteParams);
  isLoaded$ = this.store.select(newCollectionFeature.selectIsLoaded);

  ordersOptions = [
    { selectName: 'Últimas solicitades', selectValue: 'requested-DESC' },
    { selectName: 'Solicitudes más antiguas', selectValue: 'requested-ASC' },
    { selectName: 'Nombre A-Z', selectValue: 'title-ASC' },
    { selectName: 'Nombre Z-A', selectValue: 'title-DESC' },
    { selectName: 'Más votados', selectValue: 'votes' },
    { selectName: 'Mejor resultado', selectValue: 'relevance' },
  ];

  subs: Subscription = new Subscription();

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private uiSrv: UIService
  ) {}

  ngOnInit(): void {
    registerLocaleData(es);

    let routeSub = this.route.queryParams.subscribe((params) => {
      this.store.dispatch(newCollectionActions.loadParams({ params }));
    });
    this.subs.add(routeSub);
  }

  onFilter(
    orderSelectValue: string,
    statusSelectValue: number,
    searchInputValue: string
  ) {
    if (searchInputValue.trim().length == 1) {
      this.uiSrv.showSnackbar(
        'Debes ingresar al menos 2 caracteres para filtrar por texto'
      );
      return;
    }

    let actualParams = { ...this.route.snapshot.queryParams };
    this.router.navigate(['/new-collection'], {
      // relativeTo: this.route,
      queryParams: {
        ...actualParams,
        ...(searchInputValue.trim().length > 1 && {
          q: searchInputValue.trim(),
        }),
        ...(searchInputValue.trim().length <= 1 && { q: null }),
        ...(statusSelectValue !== 0 && { status: statusSelectValue }),
        ...(statusSelectValue == 0 && { status: null }),
        ...{ sortBy: orderSelectValue },
        page: null,
      },
      queryParamsHandling: 'merge',
    });
  }

  onPageChange(e: number) {
    let actualParams = { ...this.route.snapshot.queryParams };

    this.router.navigate(['/new-collection'], {
      // relativeTo: this.route,
      queryParams: {
        ...actualParams,
        page: e,
      },
      queryParamsHandling: 'merge',
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
