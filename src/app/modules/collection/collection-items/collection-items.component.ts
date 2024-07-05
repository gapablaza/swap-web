import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { filter, Subscription, tap } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';

import { SEOService } from 'src/app/core';
import { SlugifyPipe } from 'src/app/shared';
import { environment } from 'src/environments/environment';
import { CollectionSummaryComponent } from '../collection-summary/collection-summary.component';
import { CollectionItemsTableComponent } from './collection-items-table.component';
import { collectionFeature } from '../store/collection.state';
import { collectionActions } from '../store/collection.actions';

@Component({
  selector: 'app-collection-items',
  templateUrl: './collection-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    AsyncPipe,
    CollectionSummaryComponent,
    CollectionItemsTableComponent,
  ],
})
export class CollectionItemsComponent implements OnInit, OnDestroy {
  items$ = this.store.select(collectionFeature.selectItems);
  collection$ = this.store.select(collectionFeature.selectCollection);
  isLoaded$ = this.store.select(collectionFeature.selectIsItemsLoaded);

  subs: Subscription = new Subscription();

  constructor(
    private store: Store,
    private SEOSrv: SEOService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.store.dispatch(collectionActions.loadItems());

    let colSub = this.collection$
      .pipe(
        filter((col) => col != null),
        tap((col) => {
          this.SEOSrv.set({
            title: `Itemizado ${col?.name} - ${col?.publisher.data.name} (${col?.year}) - Intercambia Láminas`,
            description: `Revisa el itemizado del álbum/colección ${col?.name} de ${col?.publisher.data.name} (${col?.year}). Son ${col?.items} ítems a coleccionar (láminas / stickers / figuritas / pegatinas / cromos / estampas / barajitas).`,
            url: `${environment.appUrl}/c/${new SlugifyPipe().transform(
              col?.name + ' ' + col?.publisher.data.name
            )}/${col?.id}/items`,
            isCanonical: true,
          });
        })
      )
      .subscribe(() => {
        this.cdr.markForCheck();
      });
    this.subs.add(colSub);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
