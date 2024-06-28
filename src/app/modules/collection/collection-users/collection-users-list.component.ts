import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { orderBy } from 'lodash-es';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { Collection, DEFAULT_USER_PROFILE_IMG, User } from 'src/app/core';
import { DaysSinceLoginDirective, SanitizeHtmlPipe } from 'src/app/shared';

@Component({
  selector: 'app-collection-users-list',
  templateUrl: 'collection-users-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterLink,
    NgClass,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    FormsModule,
    LazyLoadImageModule,
    DaysSinceLoginDirective,
    SanitizeHtmlPipe,
  ],
})
export class CollectionUsersListComponent implements OnInit {
  @Input() collection!: Collection;
  @Input() users: User[] = [];

  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  showedUsers: User[] = [];
  showFilters = false;
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

  ngOnInit(): void {
    this.showedUsers = [...this.users];
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
    let tempUsers = this.users;
    // 1.- check filter by text
    // check at least 2 chars for search
    if (this.searchText.length > 1) {
      tempUsers = [
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

    this.showedUsers = [...tempUsers];
    // 3.- sorting
    this.sortShowedUsers();
  }
}
