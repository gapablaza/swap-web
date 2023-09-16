import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subscription, take } from 'rxjs';

import { History, NewCollection, NewCollectionService } from 'src/app/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf, NgFor, DatePipe } from '@angular/common';

export interface CustomHistory extends History {
  changes?: {
    field: string;
    value: string;
  }[];
}

@Component({
    selector: 'app-new-collection-history',
    templateUrl: './new-collection-history.component.html',
    styleUrls: ['./new-collection-history.component.scss'],
    standalone: true,
    imports: [MatDialogModule, NgIf, MatProgressSpinnerModule, MatTableModule, MatSortModule, RouterLink, NgFor, MatButtonModule, DatePipe]
})
export class NewCollectionHistoryComponent implements OnInit, OnDestroy {
  history: CustomHistory[] = [];
  displayedColumns: string[] = [
    'index',
    'created',
    'displayName',
    'rememberedStatusName',
    'changes',
  ];
  dataSource = new MatTableDataSource<History>([]);
  @ViewChild(MatSort, { static: false }) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  isLoaded = false;
  subs: Subscription = new Subscription();

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      newCollection: NewCollection;
    },
    private newColSrv: NewCollectionService,
    private dialogRef: MatDialogRef<NewCollectionHistoryComponent>
  ) {}

  ngOnInit(): void {
    let historySub = this.newColSrv.getHistory(this.data.newCollection.id)
      .pipe(take(1))
      .subscribe({
        next: (resp) => {
          this.history = resp;
          this.dataSource.data = resp;

          let prevCol = {} as any;
          this.history.forEach(elem => {
            let newCol = JSON.parse(elem.rememberedValue || '') as any;

            elem.changes = this.returnDiffs(prevCol, newCol);
            prevCol = newCol;
          });

          this.isLoaded = true;
        },
        error: (error) => {
          console.log(error);
          this.isLoaded = true;
        }
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
        value: newCol.name
      })
    }

    if (prevCol.year !== newCol.year) {
      diffs.push({
        field: 'Año de publicación',
        value: newCol.year
      })
    }

    if (prevCol.released !== newCol.released) {
      diffs.push({
        field: 'Fecha de publicación',
        value: newCol.released
      })
    }

    if (prevCol.publisher_id !== newCol.publisher_id) {
      diffs.push({
        field: 'ID Editorial',
        value: newCol.publisher_id
      })
    }

    if (prevCol.description !== newCol.description) {
      diffs.push({
        field: 'Descripción',
        value: newCol.description
      })
    }

    if (prevCol.validated_description !== newCol.validated_description) {
      diffs.push({
        field: 'Detalles',
        value: newCol.validated_description
      })
    }

    if (prevCol.checklist_description !== newCol.checklist_description) {
      diffs.push({
        field: 'Numeración General',
        value: newCol.checklist_description
      })
    }

    if (prevCol.image_id !== newCol.image_id) {
      diffs.push({
        field: 'ID Imagen de portada',
        value: newCol.image_id
      })
    }

    if (prevCol.validated_image_id !== newCol.validated_image_id) {
      diffs.push({
        field: 'ID Imagen de portada validada',
        value: newCol.validated_image_id
      })
    }

    if (prevCol.new_checklist_id !== newCol.new_checklist_id) {
      diffs.push({
        field: 'ID Checklist',
        value: newCol.new_checklist_id
      })
    }

    // if (prevCol.new_collection_status_id !== newCol.new_collection_status_id) {
    //   diffs.push({
    //     field: 'ID Estado',
    //     value: newCol.new_collection_status_id
    //   })
    // }

    if (prevCol.new_collection_status_comment !== newCol.new_collection_status_comment) {
      diffs.push({
        field: 'Comentario Estado',
        value: newCol.new_collection_status_comment
      })
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
