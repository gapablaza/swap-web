import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { concatMap, filter, map, Subscription, tap } from 'rxjs';
import orderBy from 'lodash/orderBy';

import {
  AuthService,
  Collection,
  DEFAULT_COLLECTION_IMG,
  DEFAULT_USER_PROFILE_IMG,
  SEOService,
  User,
  UserService,
} from 'src/app/core';
import { UserOnlyService } from '../user-only.service';
import { UserCollectionDetailsComponent } from '../user-collection-details/user-collection-details.component';

@Component({
  selector: 'app-user-collections',
  templateUrl: './user-collections.component.html',
  styleUrls: ['./user-collections.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCollectionsComponent implements OnInit, OnDestroy {
  user: User = {} as User;
  showEditButton = false;
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  defaultCollectionImage = DEFAULT_COLLECTION_IMG;
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
  showFilters = false;
  subs: Subscription = new Subscription();
  isLoaded = false;

  constructor(
    private userSrv: UserService,
    private userOnlySrv: UserOnlyService,
    private authSrv: AuthService,
    private SEOSrv: SEOService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    let userSub = this.userOnlySrv.user$
      .pipe(
        filter((user) => user.id != null),
        tap((user) => {
          this.SEOSrv.set({
            title: `Colecciones agregadas por ${user.displayName} (ID ${user.id}) - Intercambia Láminas`,
            description: `Revisa el detalle de las colecciones agregadas por ${user.displayName} (ID ${user.id}).`,
            isCanonical: true,
          });
          this.user = user;
        }),
        concatMap((user) =>
          this.userSrv.getCollections(user.id).pipe(
            map((data: { collections: Collection[]; trades: any }) => {
              return data.collections;
            })
          )
        )
      )
      .subscribe((collections) => {
        this.collections = [...collections];
        this.showedCollections = [...collections];
        this.sortShowedCollections();

        this.isLoaded = true;
        this.cdr.markForCheck();
      });
    this.subs.add(userSub);

    let authSub = this.authSrv.authUser
      .pipe(filter((authUser) => authUser.id != null))
      .subscribe((authUser) => {
        this.showEditButton = authUser.id == this.user.id;
      });
    this.subs.add(authSub);
  }

  onOpenDetails(col: Collection) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = ['user-collection'];
    dialogConfig.width = '80%';
    dialogConfig.maxWidth = '1280px';

    dialogConfig.data = {
      user: this.user,
      collection: col,
    };

    this.dialog.open(UserCollectionDetailsComponent, dialogConfig);
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
          return !elem.userSummary?.completed || false;
        }),
      ];
    }

    this.showedCollections = [...tempCollections];
    // 3.- sorting
    this.sortShowedCollections();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
