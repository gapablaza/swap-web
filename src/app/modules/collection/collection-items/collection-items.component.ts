import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { filter, Subscription, switchMap, take, tap } from 'rxjs';

import { CollectionService, Item, SEOService } from 'src/app/core';
import { SlugifyPipe } from 'src/app/shared';
import { environment } from 'src/environments/environment';
import { CollectionOnlyService } from '../collection-only.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CollectionSummaryComponent } from '../collection-summary/collection-summary.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-collection-items',
  templateUrl: './collection-items.component.html',
  styleUrls: ['./collection-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    MatProgressSpinnerModule,
    CollectionSummaryComponent,
    MatButtonModule,
    MatIconModule,
    NgClass,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    RouterLink,
  ],
})
export class CollectionItemsComponent implements OnInit, OnDestroy {
  items: Item[] = [];
  // displayedColumns: string[] = ['name', 'description', 'difficulty'];

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

  filterText = '';
  isLoaded = false;
  subs: Subscription = new Subscription();

  constructor(
    private colSrv: CollectionService,
    private colOnlySrv: CollectionOnlyService,
    private SEOSrv: SEOService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    let colSub = this.colOnlySrv.collection$
      .pipe(
        filter((col) => col.id != null),
        tap((col) => {
          this.SEOSrv.set({
            title: `Itemizado ${col.name} - ${col.publisher.data.name} (${col.year}) - Intercambia Láminas`,
            description: `Revisa el itemizado del álbum/colección ${col.name} de ${col.publisher.data.name} (${col.year}). Son ${col.items} ítems a coleccionar (láminas / stickers / figuritas / pegatinas / cromos / estampas / barajitas).`,
            url: `${environment.appUrl}/c/${new SlugifyPipe().transform(
              col.name + ' ' + col.publisher.data.name
            )}/${col.id}/items`,
            isCanonical: true,
          });
        }),
        switchMap((col) => this.colSrv.getItems(col.id).pipe(take(1)))
      )
      .subscribe((items) => {
        this.items = [
          ...items.sort((a, b) => (a.position || 0) - (b.position || 0)),
        ];
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
