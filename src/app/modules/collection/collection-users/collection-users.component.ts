import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { concatMap, filter, Subscription, take, tap } from 'rxjs';
import orderBy from 'lodash/orderBy';

import { 
  Collection, 
  CollectionService, 
  DEFAULT_USER_PROFILE_IMG, 
  User } from 'src/app/core';
import { CollectionOnlyService } from '../collection-only.service';

@Component({
  selector: 'app-collection-users',
  templateUrl: './collection-users.component.html',
  styleUrls: ['./collection-users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionUsersComponent implements OnInit, OnDestroy {
  collection: Collection = {} as Collection;
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
  subs: Subscription = new Subscription();

  constructor(
    private colSrv: CollectionService,
    private colOnlySrv: CollectionOnlyService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    let colSub = this.colOnlySrv.collection$
      .pipe(
        filter(col => col.id != null),
        tap(col => this.collection = col),
        concatMap((col) => this.colSrv.getUsers(col.id).pipe(take(1)))
      )
      .subscribe((users) => {
        console.log('CollectionUsersComponent - Sub colOnlySrv');
        this.users = [...users];
        this.showedUsers = [...users];
        this.sortShowedUsers();
        this.isLoaded = true;
        this.cdr.markForCheck();
      });
    this.subs.add(colSub);
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

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
