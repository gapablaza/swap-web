import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, catchError, filter, of, switchMap, take, tap } from 'rxjs';

import { AuthService, NewCollection, NewCollectionService, Pagination, User } from 'src/app/core';
import { UIService } from 'src/app/shared';

@Component({
  selector: 'app-new-collection-list',
  templateUrl: './new-collection-list.component.html',
  styleUrls: ['./new-collection-list.component.scss']
})
export class NewCollectionListComponent implements OnInit, OnDestroy {
  authUser: User = {} as User;
  newCollections: NewCollection[] = [];
  paginator: Pagination = {} as Pagination;

  pageSelected = 1;
  ordersOptions = [
    {
      selectName: 'Últimas solicitades',
      selectValue: 'requested-DESC',
    },
    {
      selectName: 'Solicitudes más antiguas',
      selectValue: 'requested-ASC',
    },
    {
      selectName: 'Nombre A-Z',
      selectValue: 'title-ASC',
    },
    {
      selectName: 'Nombre Z-A',
      selectValue: 'title-DESC',
    },
    {
      selectName: 'Más votados',
      selectValue: 'votes',
    },
    {
      selectName: 'Mejor resultado',
      selectValue: 'relevance',
    },
  ];
  orderSelected = 'requested-DESC';

  searchedTxt = '';
  searchTxt = '';

  isLoaded = false;
  subs: Subscription = new Subscription();

  constructor(
    private newColSrv: NewCollectionService,
    private route: ActivatedRoute,
    private router: Router,
    private authSrv: AuthService,
    private uiSrv: UIService
  ) {}

  ngOnInit(): void {
    registerLocaleData(es);

    this.authUser = this.authSrv.getCurrentUser();
    console.log(this.authUser);


    this.route.queryParamMap
      .pipe(
        tap((params) => {
          // inicializa variables
          this.isLoaded = false;
          this.searchedTxt = '';
          this.pageSelected = 1;
          this.orderSelected = 'requested-DESC';
          this.newCollections = [];
          this.paginator = {} as Pagination;

          // obtiene posibles parámetros
          const query = params.get('q');
          const page = params.get('page');
          const sortBy = params.get('sortBy');

          if (query && query.trim().length >= 2) {
            this.searchTxt = query.trim();
            this.searchedTxt = query.trim();
          }

          // https://stackoverflow.com/a/24457420
          if (page && /^\d+$/.test(page)) {
            this.pageSelected = parseInt(page);
          }

          let tempOrder = this.ordersOptions.findIndex(
            (order) => order.selectValue == sortBy
          );
          this.orderSelected =
            tempOrder >= 0 ? this.ordersOptions[tempOrder].selectValue : 'requested-DESC';
        }),
        // filter((params) => {
        //   if ((params.get('q') || '').trim().length >= 2) {
        //     return true;
        //   } else {
        //     this.showSerchHint = true;
        //     this.isLoaded = true;
        //     return false;
        //   }
        // }),
        switchMap((params) => {
          return this.newColSrv
            .list({
              query: this.searchedTxt,
              page: this.pageSelected,
              sortBy: this.orderSelected,
            })
            .pipe(
              catchError((error) => {
                if (error.error && error.error.message) {
                  this.uiSrv.showError(error.error.message);
                }
                return of({
                  newCollections: [] as NewCollection[],
                  paginator: {} as Pagination,
                });
              }),
              take(1)
            );
        })
      )
      .subscribe({
        next: (result) => {
          console.log(result);
          this.newCollections = result.newCollections;
          this.paginator = result.paginator;
          this.isLoaded = true;
        },
        error: (err) => {
          console.log(err);
          this.isLoaded = true;
        },
      });
  }

  trackByCollection(index: number, item: NewCollection): number {
    return item.id;
  }

  onSort() {
    let actualParams = this.route.snapshot.queryParams;
    
    this.router.navigate(['/new-collection'], {
      relativeTo: this.route,
      queryParams: {
        ...actualParams,
        sortBy: this.orderSelected,
      },
    });
  }

  onPageChange(e: string) {
    this.pageSelected = parseInt(e);
    let actualParams = this.route.snapshot.queryParams;

    this.router.navigate(['/new-collection'], {
      relativeTo: this.route,
      queryParams: {
        ...actualParams,
        page: this.pageSelected,
      },
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
