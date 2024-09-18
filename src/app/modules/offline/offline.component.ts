import {
  DatePipe,
  DecimalPipe,
  NgClass,
  registerLocaleData,
} from '@angular/common';
import es from '@angular/common/locales/es';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  OnDestroy,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { orderBy } from 'lodash-es';
import { MatInputModule } from '@angular/material/input';

import { Collection, DEFAULT_COLLECTION_IMG } from 'src/app/core';
import { SanitizeHtmlPipe } from 'src/app/shared';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';
import { OfflineCollectionDetailsComponent } from './offline-collection-details/offline-collection-details.component';
import { offlineFeature } from './store/offline.state';
import { offlineActions } from './store/offline.actions';

@Component({
  selector: 'app-offline',
  templateUrl: './offline.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    NgClass,
    FormsModule,
    RouterLink,

    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,

    PaginationComponent,
    SanitizeHtmlPipe,
  ],
})
export class OfflineComponent implements OnDestroy {
  isLoaded = this.store.selectSignal(
    offlineFeature.selectIsOfflineCollectionsLoaded
  );
  isProcessing = this.store.selectSignal(offlineFeature.selectIsProcessing);

  collections = this.store.selectSignal(
    offlineFeature.selectOfflineCollections
  );
  needSync = this.store.selectSignal(offlineFeature.selectNeedSyncCollections);
  needDelete = this.store.selectSignal(
    offlineFeature.selectNeedDeleteCollections
  );

  searchText = signal('');
  sortOptionSelected = signal('updated');
  hideCompleted = signal(false);
  pageSelected = signal(1);

  showFilters = false;
  recordsPerPage = 50;
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
      selectName: 'Actualización (DESC)',
      selectValue: 'updated',
      arrayFields: ['updated'],
      arrayOrders: ['desc'],
    },
    {
      selectName: 'Actualización (ASC)',
      selectValue: 'updated-',
      arrayFields: ['updated'],
      arrayOrders: ['asc'],
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
        return this.hideCompleted() ? !c.userData?.completed || false : true;
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

  onOpenDetails(col: Collection) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = ['user-collection'];
    dialogConfig.width = '80%';
    dialogConfig.maxWidth = '1280px';
    dialogConfig.data = {
      collection: col,
    };
    this.dialog.open(OfflineCollectionDetailsComponent, dialogConfig);
  }

  onSync() {
    this.store.dispatch(offlineActions.syncUserCollections());
  }

  constructor(private store: Store, private dialog: MatDialog) {
    registerLocaleData(es);
    this.store.dispatch(offlineActions.offlinePageOpened());

    effect(
      () => {
        this.searchText();
        this.hideCompleted();
        this.pageSelected.set(1);
      },
      { allowSignalWrites: true }
    );
  }

  ngOnDestroy(): void {
    this.store.dispatch(offlineActions.offlinePageClosed());
  }
}
