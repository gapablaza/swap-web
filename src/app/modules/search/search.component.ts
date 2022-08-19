import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { orderBy } from 'lodash';
import { catchError, filter, first, of, switchMap, tap } from 'rxjs';

import { Collection, Pagination, SearchService, User } from 'src/app/core';
import { UIService } from 'src/app/shared';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  users: User[] = [];
  collections: Collection[] = [];
  paginator: Pagination = {} as Pagination;
  tabsRoute = ['collection', 'user', 'publisher'];
  pageSelected = 1;
  selectedTabIndex = 0;

  searchedTxt = '';
  searchTxt = '';

  showSerchHint = false;
  isLoaded = false;

  // colSortOptionSelected = 'relevance';
  // colSortOptions = [
  //   {
  //     selectName: 'Mejor resultado',
  //     selectValue: 'relevance',
  //     arrayFields: ['relevance', 'name'],
  //     arrayOrders: ['desc', 'asc'],
  //   },
  //   {
  //     selectName: 'Nombre',
  //     selectValue: 'name',
  //     arrayFields: ['name'],
  //     arrayOrders: ['asc'],
  //   },
  //   {
  //     selectName: 'Más antiguos',
  //     selectValue: 'year-',
  //     arrayFields: ['year', 'name'],
  //     arrayOrders: ['asc', 'asc'],
  //   },
  //   {
  //     selectName: 'Más nuevos',
  //     selectValue: 'year',
  //     arrayFields: ['year', 'name'],
  //     arrayOrders: ['desc', 'asc'],
  //   },
  //   {
  //     selectName: 'Editorial',
  //     selectValue: 'publisher',
  //     arrayFields: ['publisher.data.name', 'name'],
  //     arrayOrders: ['asc', 'asc'],
  //   },
  // ];

  // userSortOptionSelected = 'relevance';
  // userSortOptions = [
  //   {
  //     selectName: 'Mejor resultado',
  //     selectValue: 'relevance',
  //     arrayFields: ['relevance', 'positives', 'displayName'],
  //     arrayOrders: ['desc', 'desc', 'asc'],
  //   },
  //   {
  //     selectName: 'Nombre',
  //     selectValue: 'name',
  //     arrayFields: ['displayName', 'positives'],
  //     arrayOrders: ['asc', 'desc'],
  //   },
  //   {
  //     selectName: 'Vistos ultimamente',
  //     selectValue: 'last-login',
  //     arrayFields: ['daysSinceLogin', 'positives', 'displayName'],
  //     arrayOrders: ['asc', 'desc', 'asc'],
  //   },
  //   {
  //     selectName: 'Más positivas',
  //     selectValue: 'positives',
  //     arrayFields: ['positives', 'displayName'],
  //     arrayOrders: ['desc', 'asc'],
  //   },
  // ];

  constructor(
    private searchSrv: SearchService,
    private route: ActivatedRoute,
    private router: Router,
    private uiSrv: UIService
  ) {}

  ngOnInit(): void {
    registerLocaleData(es);

    this.route.queryParamMap
      .pipe(
        tap((params) => {
          // inicializa variables
          this.isLoaded = false;
          this.showSerchHint = false;
          this.searchedTxt = '';
          this.pageSelected = 1;
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
          // this.searchedTxt = params['q'].trim();
          // this.searchTxt = this.searchedTxt;
          return this.searchSrv
            .search({
              query: this.searchedTxt,
              page: this.pageSelected,
              type: this.tabsRoute[this.selectedTabIndex],
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
              first()
            );
        })
      )
      .subscribe({
        next: (result) => {

          this.collections = result.collections.sort(
            (a, b) => (b.relevance || 0) - (a.relevance || 0)
          );
          this.users = result.users.sort(
            (a, b) => (b.userSummary?.relevance || 0) - (a.userSummary?.relevance || 0)
          );
          this.paginator = result.paginator;
          this.isLoaded = true;
        },
        error: (err) => {
          console.log(err);
          this.isLoaded = true;
        },
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

  
  // onCollectionSort() {
  //   this.sortShowedCollections();
  // }

  // sortShowedCollections() {
  //   let sortParams = this.colSortOptions.find(
  //     (e) => e.selectValue == this.colSortOptionSelected
  //   );
  //   this.showedCollections = orderBy(
  //     [...this.showedCollections],
  //     sortParams?.arrayFields,
  //     sortParams?.arrayOrders as ['asc' | 'desc']
  //   );
  // }

  // onUserSort() {
  //   this.sortShowedUsers();
  // }

  // sortShowedUsers() {
  //   let sortParams = this.userSortOptions.find(
  //     (e) => e.selectValue == this.userSortOptionSelected
  //   );
  //   this.showedUsers = orderBy(
  //     [...this.showedUsers],
  //     sortParams?.arrayFields,
  //     sortParams?.arrayOrders as ['asc' | 'desc']
  //   );
  // }
}
