import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { filter, Subscription, switchMap, take } from 'rxjs';

import {
  CollectionService,
  Item,
} from 'src/app/core';
import { CollectionOnlyService } from '../collection-only.service';

@Component({
  selector: 'app-collection-items',
  templateUrl: './collection-items.component.html',
  styleUrls: ['./collection-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionItemsComponent implements OnInit, OnDestroy {
  items: Item[] = [];
  // displayedColumns: string[] = ['name', 'description', 'difficulty'];
  
  displayedColumns: string[] = ['name', 'description', 'actions'];
  dataSource = new MatTableDataSource<Item>([]);
  @ViewChild(MatSort, {static: false}) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  filterText = '';
  isLoaded = false;
  subs: Subscription = new Subscription();

  constructor(
    private colSrv: CollectionService,
    private colOnlySrv: CollectionOnlyService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    let colSub = this.colOnlySrv.collection$
      .pipe(
        filter((col) => col.id != null),
        switchMap((col) => this.colSrv.getItems(col.id).pipe(take(1)))
      )
      .subscribe((items) => {
        console.log('CollectionItemsComponent - Sub colOnlySrv');
        this.items = [...items];
        this.dataSource.data = this.items;
        this.isLoaded = true;
        this.cdr.markForCheck();
      });
    this.subs.add(colSub);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onClearFilter() {
    this.filterText = '';
    this.dataSource.filter = '';
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
