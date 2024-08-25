import { DecimalPipe, NgClass, registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  EventEmitter,
  input,
  Output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { RouterLink } from '@angular/router';
import { orderBy } from 'lodash-es';

import {
  Collection,
  DEFAULT_COLLECTION_IMG,
  DEFAULT_USER_PROFILE_IMG,
} from 'src/app/core';
import { SanitizeHtmlPipe, SlugifyPipe } from 'src/app/shared';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';

@Component({
  selector: 'app-user-collections-list',
  templateUrl: './user-collections-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgClass,
    DecimalPipe,
    FormsModule,
    RouterLink,

    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,

    SanitizeHtmlPipe,
    SlugifyPipe,
    PaginationComponent,
  ],
})
export class UserCollectionsListComponent {
  @Output() onOpenDetails = new EventEmitter<Collection>();
  collections = input.required<Collection[]>();
  showEditButton = input<boolean>(false);

  searchText = signal('');
  sortOptionSelected = signal('name');
  hideCompleted = signal(false);
  pageSelected = signal(1);

  showFilters = false;
  recordsPerPage = 50;
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  defaultCollectionImage = DEFAULT_COLLECTION_IMG;
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

  managedCollections = computed(() => {
    const filterText = this.searchText();
    const sortOption = this.sortOptions.find(
      (option) => option.selectValue === this.sortOptionSelected()
    );

    let filteredCollections = this.collections()
      // se filtra por texto
      .filter((c) => this.applyFilter(c, filterText))
      // se filtra por completados
      .filter((c) => {
        return this.hideCompleted() ? !c.userSummary?.completed || false : true;
      });

    // se ordena
    if (sortOption) {
      filteredCollections = orderBy(
        [...filteredCollections],
        sortOption.arrayFields,
        sortOption.arrayOrders as ['asc' | 'desc']
      );
    }

    return filteredCollections;
  });

  showedCollections = computed(() => {
    const page = this.pageSelected();
    const startIndex = (page - 1) * this.recordsPerPage;
    const endIndex = page * this.recordsPerPage;

    return this.managedCollections().slice(startIndex, endIndex);
  });

  lastPage = computed(() => {
    if (this.managedCollections().length == 0) {
      return 1;
    }

    return Math.ceil(this.managedCollections().length / this.recordsPerPage);
  });

  fromRecord = computed(() => {
    const page = this.pageSelected();
    return Math.min(
      (page - 1) * this.recordsPerPage + 1,
      this.managedCollections().length
    );
  });

  toRecord = computed(() => {
    const page = this.pageSelected();
    const endRecord = page * this.recordsPerPage;
    return Math.min(endRecord, this.managedCollections().length);
  });

  applyFilter(collection: Collection, searchText: string): boolean {
    if (searchText.length <= 1) {
      return true;
    }

    return (
      collection.name
        .toLocaleLowerCase()
        .indexOf(searchText.toLocaleLowerCase()) !== -1 ||
      collection.id.toString().indexOf(searchText.toLocaleLowerCase()) !== -1 ||
      collection.publisher.data.name
        .toLocaleLowerCase()
        .indexOf(searchText.toLocaleLowerCase()) !== -1
    );
  }

  onClearFilter() {
    this.searchText.set('');
  }

  onToggleCompleted(e: MatSlideToggleChange) {
    const { checked } = e;
    this.hideCompleted.set(checked);
  }

  onPageChange(page: number) {
    this.pageSelected.set(page);
  }

  constructor() {
    registerLocaleData(es);

    effect(
      () => {
        this.searchText();
        this.hideCompleted();
        this.pageSelected.set(1);
      },
      { allowSignalWrites: true }
    );
  }
}
