import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NgClass, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatest, map, Subscription, tap } from 'rxjs';
import orderBy from 'lodash/orderBy';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import {
  Collection,
  DEFAULT_COLLECTION_IMG,
  DEFAULT_USER_PROFILE_IMG,
  SEOService,
} from 'src/app/core';
import { SlugifyPipe } from '../../../shared/pipes/slugify.pipe';
import { SanitizeHtmlPipe } from '../../../shared/pipes/sanitize-html.pipe';
import { UserSummaryComponent } from '../user-summary/user-summary.component';
import { UserCollectionDetailsComponent } from '../user-collection-details/user-collection-details.component';
import { userFeature } from '../store/user.state';
import { authFeature } from '../../auth/store/auth.state';
import { userActions } from '../store/user.actions';

@Component({
  selector: 'app-user-collections',
  templateUrl: './user-collections.component.html',
  styleUrls: ['./user-collections.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    UserSummaryComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    NgClass,
    MatInputModule,
    FormsModule,
    MatSlideToggleModule,
    RouterLink,
    LazyLoadImageModule,
    SanitizeHtmlPipe,
    SlugifyPipe,
    AsyncPipe,
  ],
})
export class UserCollectionsComponent implements OnInit, OnDestroy {
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  defaultCollectionImage = DEFAULT_COLLECTION_IMG;

  authUser$ = this.store.select(authFeature.selectUser);
  user$ = this.store.select(userFeature.selectUser);
  collections$ = this.store.select(userFeature.selectCollections);
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

  showFilters = false;
  hideCompleted = false;
  showEditButton = false;
  isLoaded$ = this.store.select(userFeature.selectIsCollectionsLoaded);
  subs: Subscription = new Subscription();

  constructor(
    private store: Store,
    private SEOSrv: SEOService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.store.dispatch(userActions.loadUserCollections());

    let colSubs = combineLatest([this.user$, this.collections$, this.authUser$])
      .pipe(
        tap(([user, collections, authUser]) => {
          this.SEOSrv.set({
            title: `Colecciones agregadas por ${user.displayName} (ID ${user.id}) - Intercambia Láminas`,
            description: `Revisa el detalle de las colecciones agregadas por ${user.displayName} (ID ${user.id}).`,
            isCanonical: true,
          });

          if (authUser && authUser.id == user.id) {
            this.showEditButton = true;
          } else {
            this.showEditButton = false;
          }
        }),
        map(([user, collections, authUser]) => collections)
      )
      .subscribe((collections) => {
        this.collections = [...collections];
        this.showedCollections = [...collections];
        this.sortShowedCollections();

        this.cdr.markForCheck();
      });
    this.subs.add(colSubs);
  }

  onOpenDetails(col: Collection) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = ['user-collection'];
    dialogConfig.width = '80%';
    dialogConfig.maxWidth = '1280px';
    dialogConfig.data = {
      // user: this.user,
      collection: col,
    };
    this.dialog.open(UserCollectionDetailsComponent, dialogConfig);
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
