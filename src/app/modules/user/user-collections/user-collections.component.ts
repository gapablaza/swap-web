import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { concatMap, map, of } from 'rxjs';
import { orderBy } from 'lodash';

import { Collection, User, UserService } from 'src/app/core';
import { UserOnlyService } from '../user-only.service';

@Component({
  selector: 'app-user-collections',
  templateUrl: './user-collections.component.html',
  styleUrls: ['./user-collections.component.scss'],
})
export class UserCollectionsComponent implements OnInit {
  user: User = {} as User;
  collections: Collection[] = [];
  showedCollections: Collection[] = [];

  searchText = '';
  sortOptionSelected = 'name';
  sortOptions = [
    {
      selectName: 'Nombre',
      selectValue: 'name',
      arrayFields: ['name'],
      arrayOrders: ['asc'],
    },
    {
      selectName: 'Más nuevos',
      selectValue: 'year',
      arrayFields: ['year', 'name'],
      arrayOrders: ['desc', 'asc'],
    },
    {
      selectName: 'Más antiguos',
      selectValue: 'year-',
      arrayFields: ['year', 'name'],
      arrayOrders: ['asc', 'asc'],
    },
    {
      selectName: 'Mayor progreso',
      selectValue: 'progress',
      arrayFields: ['summary.progress', 'name'],
      arrayOrders: ['desc', 'asc'],
    },
    {
      selectName: 'Menor progreso',
      selectValue: 'progress-',
      arrayFields: ['summary.progress', 'name'],
      arrayOrders: ['asc', 'asc'],
    },
  ];
  hideCompleted = false;
  isLoaded = false;

  constructor(
    private userSrv: UserService,
    private userOnlySrv: UserOnlyService
  ) {}

  ngOnInit(): void {
    this.userOnlySrv.user$
      .pipe(
        concatMap((user) => {
          if (user.id) {
            this.user = user;
            return this.userSrv.getCollections(user.id).pipe(
              map((data: { collections: Collection[]; trades: any }) => {
                return data.collections;
              })
            );
          } else {
            return of([]);
          }
        })
      )
      .subscribe((collections) => {
        this.collections = [...collections];
        this.showedCollections = [...collections];
        this.sortShowedCollections();

        if (this.user.id) {
          this.isLoaded = true;
        }
      });
    console.log('from UserCollectionsComponent');
  }

  trackByCollection(index: number, item: Collection): number {
    return item.id;
  }

  onFilter() {
    this.filterShowedCollection();
  }

  onClearFilter() {
    this.searchText = '';
    this.filterShowedCollection();
  }

  onSort() {
    this.sortShowedCollections();
  }

  onToggleCompleted(e: MatSlideToggleChange) {
    const { checked } = e;
    this.hideCompleted = checked;
    this.filterShowedCollection();
  }

  sortShowedCollections() {
    let sortParams = this.sortOptions.find(
      (e) => e.selectValue == this.sortOptionSelected
    );
    this.showedCollections = orderBy(
      [...this.showedCollections],
      sortParams?.arrayFields,
      sortParams?.arrayOrders as ['asc' | 'desc']
    );
  }

  filterShowedCollection() {
    let tempCollections = this.collections;
    // 1.- check filter by text
    // check at least 2 chars for search
    if (this.searchText.length > 1) {
      tempCollections = [
        ...this.collections.filter((elem: Collection) => {
          return (
            elem.name
              .toLocaleLowerCase()
              .indexOf(this.searchText.toLocaleLowerCase()) !== -1 ||
            elem.publisher.data.name
              .toLocaleLowerCase()
              .indexOf(this.searchText.toLocaleLowerCase()) !== -1 ||
            elem.id.toString().indexOf(this.searchText.toLocaleLowerCase()) !==
              -1
          );
        }),
      ];
    }

    // 2.- check filter by completed
    if (this.hideCompleted) {
      tempCollections = [
        ...tempCollections.filter((elem) => {
          return !elem.summary?.completed || false;
        }),
      ];
    }

    this.showedCollections = [...tempCollections];
    // 3.- sorting
    this.sortShowedCollections();
  }
}
