import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';

import { Item } from 'src/app/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-collection-items-table',
  templateUrl: 'collection-items-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgClass,
    RouterLink,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatSortModule,
  ],
})
export class CollectionItemsTableComponent implements OnInit {
  @Input() items: Item[] = [];

  filterText = '';
  displayedColumns: string[] = [
    'name',
    'description',
    'itemType',
    'section',
    'actions',
  ];
  dataSource = new MatTableDataSource<Item>([]);
  @ViewChild(MatSort, { static: false }) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  ngOnInit() {
    this.dataSource.data = this.items;
    this.dataSource.filterPredicate = this.customFilterPredicate;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onClearFilter() {
    this.filterText = '';
    this.dataSource.filter = '';
  }

  customFilterPredicate(data: Item, filter: string): boolean {
    const transformedFilter = filter.trim().toLowerCase();
    const matchesName = data.name.toLowerCase().includes(transformedFilter);
    const matchesDescription = data.description.toLowerCase().includes(transformedFilter);
    const matchesItemType = (data.itemType || '').toLowerCase().includes(transformedFilter);
    const matchesSection = (data.section || '').toLowerCase().includes(transformedFilter);

    return matchesName || matchesDescription || matchesItemType || matchesSection;
  }
}
