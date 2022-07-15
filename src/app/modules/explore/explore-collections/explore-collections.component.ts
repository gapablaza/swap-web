import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { filter, switchMap } from 'rxjs';

import {
  AuthService,
  Collection,
  DEFAULT_COLLECTION_IMG,
  Pagination,
  SearchService,
  User,
} from 'src/app/core';

@Component({
  selector: 'app-explore-collections',
  templateUrl: './explore-collections.component.html',
  styleUrls: ['./explore-collections.component.scss'],
})
export class ExploreCollectionsComponent implements OnInit {
  collections: Collection[] = [];
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
  isLoaded = false;

  constructor(
    private searchSrv: SearchService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authSrv: AuthService,
  ) {}

  ngOnInit(): void {
    registerLocaleData( es );

    // get possible auth User
    this.authSrv.authUser
      .pipe(
        filter(user => user.id != null)
      )
      .subscribe(user => {
        this.authUser = user;
      })

    // process pagination params
    this.activatedRoute.queryParamMap
      .pipe(
        switchMap((paramMap) => {
          this.isLoaded = false;
          const page = paramMap.get('page');
          const sortBy = paramMap.get('sortBy');

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

          return this.searchSrv.exploreCollections({
            page: this.pageSelected,
            sortBy: this.sortOptionSelected,
          });
        })
      )
      .subscribe((data) => {
        this.collections = data.collections;
        this.paginator = data.paginator;
        this.isLoaded = true;
      });
  }

  onSort() {
    this.router.navigate(['/explore/collections'], {
      queryParams: {
        page: this.pageSelected,
        sortBy: this.sortOptionSelected,
      },
    });
  }

  onPageChange(e: string) {
    this.pageSelected = parseInt(e);
    this.router.navigate(['/explore/collections'], {
      queryParams: {
        page: this.pageSelected,
        sortBy: this.sortOptionSelected,
      },
    });
  }
}
