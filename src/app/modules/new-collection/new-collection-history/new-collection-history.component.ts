import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { filter, Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';

import { History, NewCollection } from 'src/app/core';
import { newCollectionFeature } from '../store/new-collection.state';
import { newCollectionActions } from '../store/new-collection.actions';

export interface CustomHistory extends History {
  changes?: {
    field: string;
    value: string;
  }[];
}

@Component({
  selector: 'app-new-collection-history',
  templateUrl: './new-collection-history.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    RouterLink,

    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
  ],
})
export class NewCollectionHistoryComponent implements OnInit, OnDestroy {
  history$ = this.store.select(newCollectionFeature.selectNewCollectionHistory);
  isLoaded$ = this.store.select(newCollectionFeature.selectIsHistoryLoaded);

  history: CustomHistory[] = [];
  displayedColumns: string[] = [
    'index',
    'created',
    'displayName',
    'rememberedStatusName',
    'changes',
  ];
  dataSource = new MatTableDataSource<CustomHistory>([]);
  @ViewChild(MatSort, { static: false }) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  subs: Subscription = new Subscription();

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      newCollection: NewCollection;
    },
    private store: Store,
    private dialogRef: MatDialogRef<NewCollectionHistoryComponent>
  ) {}

  ngOnInit(): void {
    this.store.dispatch(newCollectionActions.loadHistory());

    let historySub = this.history$
      .pipe(filter((resp) => resp.length > 0))
      .subscribe({
        next: (resp) => {
          let prevCol = {} as any;
          let newCol = {} as any;
          let diffs = {} as any;
          
          this.history = resp.map((elem) => {
            newCol = JSON.parse(elem.rememberedValue || '') as any;
            diffs = this.returnDiffs(prevCol, newCol);
            prevCol = newCol;

            return {
              ...elem,
              changes: diffs,
            };
          });
          this.dataSource.data = this.history;
        },
        error: (error) => {
          console.log(error);
        },
      });
    this.subs.add(historySub);
  }

  returnDiffs(prevCol: any, newCol: any) {
    let diffs: {
      field: string;
      value: string;
    }[] = [];

    if (prevCol.name !== newCol.name) {
      diffs.push({
        field: 'Título',
        value: newCol.name,
      });
    }

    if (prevCol.year !== newCol.year) {
      diffs.push({
        field: 'Año de publicación',
        value: newCol.year,
      });
    }

    if (prevCol.released !== newCol.released) {
      diffs.push({
        field: 'Fecha de publicación',
        value: newCol.released,
      });
    }

    if (prevCol.publisher_id !== newCol.publisher_id) {
      diffs.push({
        field: 'ID Editorial',
        value: newCol.publisher_id,
      });
    }

    if (prevCol.description !== newCol.description) {
      diffs.push({
        field: 'Descripción',
        value: newCol.description,
      });
    }

    if (prevCol.validated_description !== newCol.validated_description) {
      diffs.push({
        field: 'Detalles',
        value: newCol.validated_description,
      });
    }

    if (prevCol.checklist_description !== newCol.checklist_description) {
      diffs.push({
        field: 'Numeración General',
        value: newCol.checklist_description,
      });
    }

    if (prevCol.image_id !== newCol.image_id) {
      diffs.push({
        field: 'ID Imagen de portada',
        value: newCol.image_id,
      });
    }

    if (prevCol.validated_image_id !== newCol.validated_image_id) {
      diffs.push({
        field: 'ID Imagen de portada validada',
        value: newCol.validated_image_id,
      });
    }

    if (prevCol.new_checklist_id !== newCol.new_checklist_id) {
      diffs.push({
        field: 'ID Checklist',
        value: newCol.new_checklist_id,
      });
    }

    // if (prevCol.new_collection_status_id !== newCol.new_collection_status_id) {
    //   diffs.push({
    //     field: 'ID Estado',
    //     value: newCol.new_collection_status_id
    //   })
    // }

    if (
      prevCol.new_collection_status_comment !==
      newCol.new_collection_status_comment
    ) {
      diffs.push({
        field: 'Comentario Estado',
        value: newCol.new_collection_status_comment,
      });
    }

    return diffs;
  }

  onClose() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
