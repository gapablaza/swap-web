import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { ChecklistItem, ItemType, NewChecklist, NewCollection } from 'src/app/core';

@Component({
  selector: 'app-new-collection-checklist',
  templateUrl: './new-collection-checklist.component.html',
  styleUrls: ['./new-collection-checklist.component.scss'],
})
export class NewCollectionChecklistComponent implements OnInit {
  validTypes: number[] = [];
  displayedColumns: string[] = [
    'name',
    'itemTypeId',
    'itemTypeDescription',
    'description',
    'section',
    // 'position',
  ];
  dataSource = new MatTableDataSource<ChecklistItem>([]);
  @ViewChild(MatSort, { static: false }) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  isLoaded = true;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      newCollection: NewCollection;
      checklist: NewChecklist;
      types: ItemType[];
    },
    private dialogRef: MatDialogRef<NewCollectionChecklistComponent>
  ) {}

  ngOnInit(): void {
    this.validTypes = this.data.types.map(a => a.id);
    this.dataSource.data = this.data.checklist.items.map(elem => {
      return {
        ...elem,
        itemTypeDescription: this.getTIPOName(elem.itemTypeId)
      }
    });
  }

  getTIPOName(type: any): string {
    if (!Number.isInteger(type)) return '';
    if (!this.validTypes.includes(type)) return '';
    return this.data.types.find(i => i.id == Number(type))?.name || '';
  }

  onClose() {
    this.dialogRef.close();
  }
}
