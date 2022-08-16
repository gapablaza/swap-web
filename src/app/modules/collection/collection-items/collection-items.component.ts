import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { filter, first, Subscription, switchMap, tap } from 'rxjs';

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
  displayedColumns: string[] = ['name', 'description'];
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
        switchMap((col) => this.colSrv.getItems(col.id).pipe(first()))
      )
      .subscribe((items) => {
        console.log('CollectionItemsComponent - Sub colOnlySrv');
        this.items = items;
        this.isLoaded = true;
        this.cdr.markForCheck();
      });
    this.subs.add(colSub);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
