import { Component, OnInit } from '@angular/core';
import { concatMap, of } from 'rxjs';
import { orderBy } from 'lodash';

import { 
  Collection, 
  CollectionService, 
  DEFAULT_COLLECTION_IMG, 
  DEFAULT_USER_PROFILE_IMG, 
  User } from 'src/app/core';
import { CollectionOnlyService } from '../collection-only.service';

@Component({
  selector: 'app-collection-users',
  templateUrl: './collection-users.component.html',
  styleUrls: ['./collection-users.component.scss'],
})
export class CollectionUsersComponent implements OnInit {
  collection: Collection = {} as Collection;
  defaultCollectionImage = DEFAULT_COLLECTION_IMG;
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  users: User[] = [];
  showedUsers: User[] = [];

  searchText = '';
  sortOptionSelected = 'update';
  sortOptions = [
    {
      selectName: 'Última actualización',
      selectValue: 'update',
      arrayFields: ['summary.daysSinceUpdate', 'positives'],
      arrayOrders: ['asc', 'desc'],
    },
    {
      selectName: 'Más positivas',
      selectValue: 'positives',
      arrayFields: ['positives', 'displayName'],
      arrayOrders: ['desc', 'asc'],
    },
    {
      selectName: 'Nombre',
      selectValue: 'name',
      arrayFields: ['displayName'],
      arrayOrders: ['asc'],
    },
  ];
  showFilters = false;
  isLoaded = false;

  constructor(
    private colSrv: CollectionService,
    private colOnlySrv: CollectionOnlyService
  ) {}

  ngOnInit(): void {
    this.colOnlySrv.collection$
      .pipe(
        concatMap((col) => {
          if (col.id) {
            this.collection = col;
            return this.colSrv.getUsers(col.id);
          } else {
            return of([]);
          }
        })
      )
      .subscribe((users) => {
        this.users = users;
        this.showedUsers = [...this.users];
        this.sortShowedUsers();

        if (this.collection.id) {
          this.isLoaded = true;
        }
      });
  }

  trackByUsers(index: number, item: User): number {
    return item.id;
  }

  onFilter() {
    this.filterShowedUsers();
  }

  onClearFilter() {
    this.searchText = '';
    this.filterShowedUsers();
  }

  onSort() {
    this.sortShowedUsers();
  }

  sortShowedUsers() {
    let sortParams = this.sortOptions.find(
      (e) => e.selectValue == this.sortOptionSelected
    );
    this.showedUsers = orderBy(
      [...this.showedUsers],
      sortParams?.arrayFields,
      sortParams?.arrayOrders as ['asc' | 'desc']
    );
  }

  filterShowedUsers() {
    let tempCollections = this.users;
    // 1.- check filter by text
    // check at least 2 chars for search
    if (this.searchText.length > 1) {
      tempCollections = [
        ...this.users.filter((elem: User) => {
          return (
            elem.displayName
              .toLocaleLowerCase()
              .indexOf(this.searchText.toLocaleLowerCase()) !== -1 ||
            (elem.location || '')
              .toLocaleLowerCase()
              .indexOf(this.searchText.toLocaleLowerCase()) !== -1 ||
            (elem.bio || '')
              .toLocaleLowerCase()
              .indexOf(this.searchText.toLocaleLowerCase()) !== -1 ||
            elem.id.toString().indexOf(this.searchText.toLocaleLowerCase()) !==
              -1
          );
        }),
      ];
    }

    this.showedUsers = [...tempCollections];
    // 3.- sorting
    this.sortShowedUsers();
  }
}
