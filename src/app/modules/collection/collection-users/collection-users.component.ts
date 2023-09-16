import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { concatMap, filter, Subscription, take, tap } from 'rxjs';
import orderBy from 'lodash/orderBy';

import { 
  Collection, 
  CollectionService, 
  DEFAULT_USER_PROFILE_IMG, 
  SEOService, 
  User } from 'src/app/core';
import { CollectionOnlyService } from '../collection-only.service';
import { environment } from 'src/environments/environment';
import { SlugifyPipe } from 'src/app/shared';
import { SanitizeHtmlPipe } from '../../../shared/pipes/sanitize-html.pipe';
import { DaysSinceLoginDirective } from '../../../shared/directives/days-since-login.directive';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CollectionSummaryComponent } from '../collection-summary/collection-summary.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf, NgFor, NgClass } from '@angular/common';

@Component({
    selector: 'app-collection-users',
    templateUrl: './collection-users.component.html',
    styleUrls: ['./collection-users.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
        MatProgressSpinnerModule,
        CollectionSummaryComponent,
        MatButtonModule,
        RouterLink,
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        NgFor,
        MatOptionModule,
        NgClass,
        MatInputModule,
        FormsModule,
        LazyLoadImageModule,
        DaysSinceLoginDirective,
        SanitizeHtmlPipe,
    ],
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
    private SEOSrv: SEOService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    let colSub = this.colOnlySrv.collection$
      .pipe(
        filter(col => col.id != null),
        tap(col => {
          this.collection = col;

          this.SEOSrv.set({
            title: `Usuarios coleccionando ${col.name} - ${col.publisher.data.name} (${col.year}) - Intercambia Láminas`,
            description: `Revisa los distintos usuarios que están juntando el álbum/colección ${col.name} de ${col.publisher.data.name} (${col.year}).`,
            url: `${environment.appUrl}/c/${new SlugifyPipe().transform(col.name + ' ' + col.publisher.data.name)}/${col.id}/users`,
            isCanonical: true,
          })
        }
        ),
        concatMap((col) => this.colSrv.getUsers(col.id).pipe(take(1)))
      )
      .subscribe((users) => {
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
