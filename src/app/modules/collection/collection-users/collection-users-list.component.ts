import { DecimalPipe, NgClass, registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  Input,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { orderBy } from 'lodash-es';

import { Collection, DEFAULT_USER_PROFILE_IMG, User } from 'src/app/core';
import { DaysSinceLoginDirective, SanitizeHtmlPipe } from 'src/app/shared';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';

@Component({
  selector: 'app-collection-users-list',
  templateUrl: 'collection-users-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    RouterLink,
    DecimalPipe,

    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,

    PaginationComponent,
    DaysSinceLoginDirective,
    SanitizeHtmlPipe,
  ],
})
export class CollectionUsersListComponent {
  @Input() collection!: Collection;
  users = input.required<User[]>();
  searchText = signal('');
  sortOptionSelected = signal('update');
  pageSelected = signal(1);

  showFilters = false;
  recordsPerPage = 50;
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
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

  managedUsers = computed(() => {
    const filterText = this.searchText();
    const sortOption = this.sortOptions.find(
      (option) => option.selectValue === this.sortOptionSelected()
    );

    let filteredUsers = this.users().filter((u) =>
      this.applyFilter(u, filterText)
    );

    if (sortOption) {
      filteredUsers = orderBy(
        [...filteredUsers],
        sortOption.arrayFields,
        sortOption.arrayOrders as ['asc' | 'desc']
      );
    }

    return filteredUsers;
  });

  visibleUsers = computed(() => {
    const page = this.pageSelected();
    const startIndex = (page - 1) * this.recordsPerPage;
    const endIndex = page * this.recordsPerPage;

    return this.managedUsers().slice(startIndex, endIndex);
  });

  lastPage = computed(() => {
    if (this.managedUsers().length == 0) {
      return 1;
    }

    return Math.ceil(this.managedUsers().length / this.recordsPerPage);
  });

  fromRecord = computed(() => {
    const page = this.pageSelected();
    return Math.min(
      (page - 1) * this.recordsPerPage + 1,
      this.managedUsers().length
    );
  });

  toRecord = computed(() => {
    const page = this.pageSelected();
    const endRecord = page * this.recordsPerPage;
    return Math.min(endRecord, this.managedUsers().length);
  });

  applyFilter(user: User, searchText: string): boolean {
    if (searchText.length <= 1) {
      return true;
    }
    return (
      user.displayName
        .toLocaleLowerCase()
        .indexOf(searchText.toLocaleLowerCase()) !== -1 ||
      (user.location || '')
        .toLocaleLowerCase()
        .indexOf(searchText.toLocaleLowerCase()) !== -1 ||
      (user.bio || '')
        .toLocaleLowerCase()
        .indexOf(searchText.toLocaleLowerCase()) !== -1 ||
      user.id.toString().indexOf(searchText.toLocaleLowerCase()) !== -1
    );
  }

  onClearFilter() {
    this.searchText.set('');
  }

  onSort(sortOption: string) {
    this.sortOptionSelected.set(sortOption);
  }

  onPageChange(page: number) {
    this.pageSelected.set(page);
  }

  constructor() {
    registerLocaleData(es);

    effect(
      () => {
        this.searchText();
        this.pageSelected.set(1);
      },
      { allowSignalWrites: true }
    );
  }
}
