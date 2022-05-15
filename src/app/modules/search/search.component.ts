import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { orderBy } from 'lodash';
import { concatMap, of, throwError } from 'rxjs';

import { Collection, DEFAULT_COLLECTION_IMG, DEFAULT_USER_PROFILE_IMG, SearchService, User } from 'src/app/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  users: User[] = [];
  showedUsers: User[] = [];
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  collections: Collection[] = [];
  defaultCollectionImage = DEFAULT_COLLECTION_IMG;
  showedCollections: Collection[] = [];

  searchTxt = '';
  colFilterText = '';
  colSortOptionSelected = 'relevance';
  colSortOptions = [
    {
      selectName: 'Mejor resultado',
      selectValue: 'relevance',
      arrayFields: ['relevance', 'name'],
      arrayOrders: ['desc', 'asc'],
    },
    {
      selectName: 'Nombre',
      selectValue: 'name',
      arrayFields: ['name'],
      arrayOrders: ['asc'],
    },
    {
      selectName: 'Más antiguos',
      selectValue: 'year-',
      arrayFields: ['year', 'name'],
      arrayOrders: ['asc', 'asc'],
    },
    {
      selectName: 'Más nuevos',
      selectValue: 'year',
      arrayFields: ['year', 'name'],
      arrayOrders: ['desc', 'asc'],
    },
    {
      selectName: 'Editorial',
      selectValue: 'publisher',
      arrayFields: ['publisher.data.name', 'name'],
      arrayOrders: ['asc', 'asc'],
    },
  ];

  userFilterText = '';
  userSortOptionSelected = 'relevance';
  userSortOptions = [
    {
      selectName: 'Mejor resultado',
      selectValue: 'relevance',
      arrayFields: ['relevance', 'positives', 'displayName'],
      arrayOrders: ['desc', 'desc', 'asc'],
    },
    {
      selectName: 'Nombre',
      selectValue: 'name',
      arrayFields: ['displayName', 'positives'],
      arrayOrders: ['asc', 'desc'],
    },
    {
      selectName: 'Vistos ultimamente',
      selectValue: 'last-login',
      arrayFields: ['daysSinceLogin', 'positives', 'displayName'],
      arrayOrders: ['asc', 'desc', 'asc'],
    },
    {
      selectName: 'Más positivas',
      selectValue: 'positives',
      arrayFields: ['positives', 'displayName'],
      arrayOrders: ['desc', 'asc'],
    },
  ];
  isLoaded = false;

  constructor(
    private searchSrv: SearchService,
    private route: ActivatedRoute
    ) {}

  ngOnInit(): void {
    registerLocaleData( es );
    
    this.route.queryParams
      .pipe(
        concatMap((params) => {
          this.isLoaded = false;
          if (params['q']) {
            this.searchTxt = params['q'];
            return this.searchSrv.searchByText(this.searchTxt);
          } else {
            return throwError(() => false);
          }
        })
      )
      .subscribe({
        next: (result) => {
          this.collections = result.collections;
          this.showedCollections = [...result.collections];
          this.sortShowedCollections();

          this.users = result.users;
          this.showedUsers = [...result.users];
          this.sortShowedUsers();

          this.isLoaded = true;
        },
        error: (err) => {
          console.log(err);
          this.isLoaded = true;
        }
      });
  }

  trackByCollection(index: number, item: Collection): number {
    return item.id;
  }

  onCollectionFilter() {
    this.filterShowedCollections();
  }

  onClearCollectionFilter() {
    this.colFilterText = '';
    this.filterShowedCollections();
  }

  onCollectionSort() {
    this.sortShowedCollections();
  }

  sortShowedCollections() {
    let sortParams = this.colSortOptions.find(
      (e) => e.selectValue == this.colSortOptionSelected
    );
    this.showedCollections = orderBy(
      [...this.showedCollections],
      sortParams?.arrayFields,
      sortParams?.arrayOrders as ['asc' | 'desc']
    );
  }

  filterShowedCollections() {
    let tempCollections = this.collections;
    // 1.- check filter by text
    // check at least 2 chars for search
    if (this.colFilterText.length > 1) {
      tempCollections = [
        ...this.collections.filter((elem: Collection) => {
          return (
            elem.name
              .toLocaleLowerCase()
              .indexOf(this.colFilterText.toLocaleLowerCase()) !== -1 ||
            elem.publisher.data.name
              .toLocaleLowerCase()
              .indexOf(this.colFilterText.toLocaleLowerCase()) !== -1 ||
            elem.id.toString().indexOf(this.colFilterText.toLocaleLowerCase()) !==
              -1 ||
            elem.year.toString().indexOf(this.colFilterText.toLocaleLowerCase()) !==
              -1
          );
        }),
      ];
    }

    this.showedCollections = [...tempCollections];
    // 3.- sorting
    this.sortShowedCollections();
  }

  trackByUsers(index: number, item: User): number {
    return item.id;
  }

  onUserFilter() {
    this.filterShowedUsers();
  }

  onClearUserFilter() {
    this.userFilterText = '';
    this.filterShowedUsers();
  }

  onUserSort() {
    this.sortShowedUsers();
  }

  sortShowedUsers() {
    let sortParams = this.userSortOptions.find(
      (e) => e.selectValue == this.userSortOptionSelected
    );
    this.showedUsers = orderBy(
      [...this.showedUsers],
      sortParams?.arrayFields,
      sortParams?.arrayOrders as ['asc' | 'desc']
    );
  }

  filterShowedUsers() {
    let tempUsers = this.users;
    // 1.- check filter by text
    // check at least 2 chars for search
    if (this.userFilterText.length > 1) {
      tempUsers = [
        ...this.users.filter((elem: User) => {
          return (
            elem.displayName
              .toLocaleLowerCase()
              .indexOf(this.userFilterText.toLocaleLowerCase()) !== -1 ||
            (elem.location || '')
              .toLocaleLowerCase()
              .indexOf(this.userFilterText.toLocaleLowerCase()) !== -1 ||
            (elem.bio || '')
              .toLocaleLowerCase()
              .indexOf(this.userFilterText.toLocaleLowerCase()) !== -1 ||
            elem.id.toString().indexOf(this.userFilterText.toLocaleLowerCase()) !==
              -1
          );
        }),
      ];
    }

    this.showedUsers = [...tempUsers];
    // 3.- sorting
    this.sortShowedUsers();
  }
}

