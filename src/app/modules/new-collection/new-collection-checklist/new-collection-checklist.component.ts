import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-new-collection-checklist',
  templateUrl: './new-collection-checklist.component.html',
  styleUrls: ['./new-collection-checklist.component.scss'],
})
export class NewCollectionChecklistComponent {
  items: any[] = [];
  displayedColumns: string[] = [
    'name',
    'category',
    'section',
    'description',
    // 'position',
  ];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatSort, { static: false }) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  isLoaded = true;

  constructor(
    private dialogRef: MatDialogRef<NewCollectionChecklistComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.items = [
      {
        name: '1',
        category: 'Sticker',
        section: 'Sección uno',
        description: 'Descripción 1',
        position: '10',
      },
      {
        name: '2',
        category: 'Sticker',
        section: 'Sección uno',
        description: 'Descripción 2',
        position: '20',
      },
      {
        name: 3,
        category: 'Sticker',
        section: 'Sección uno',
        description: 'Descripción 3',
        position: '30',
      },
      {
        name: 4,
        category: 'Sticker',
        section: 'Sección dos',
        description: 'Descripción 4',
        position: '40',
      },
      {
        name: 5,
        category: 'Sticker',
        section: 'Sección dos',
        description: 'Descripción 5',
        position: '50',
      },
      {
        name: 'C1',
        category: 'Carta',
        section: 'Cartas',
        description: 'Descripción 6',
        position: '100',
      },
      {
        name: 'C2',
        category: 'Carta',
        section: 'Cartas',
        description: 'Descripción 7',
        position: '200',
      },
      {
        name: 'C3',
        category: 'Carta',
        section: 'Cartas',
        description: 'Descripción 8',
        position: '300',
      },
    ];
    this.dataSource.data = this.items;
  }

  onClose() {
    this.dialogRef.close();
  }
}
