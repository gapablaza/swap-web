import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { filter, Subscription, tap } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';

import { SEOService } from 'src/app/core';
import { SlugifyPipe } from 'src/app/shared';
import { environment } from 'src/environments/environment';
import { authFeature } from '../../auth/store/auth.state';
import { collectionFeature } from '../store/collection.state';
import { CollectionTopsCategoriesComponent } from './collection-tops-categories.component';
import { collectionActions } from '../store/collection.actions';
import { CollectionSummaryComponent } from '../collection-summary/collection-summary.component';

@Component({
  selector: 'app-collection-tops',
  templateUrl: './collection-tops.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    AsyncPipe,
    CollectionSummaryComponent,
    CollectionTopsCategoriesComponent,
  ],
})
export class CollectionTopsComponent implements OnInit, OnDestroy {
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  collection$ = this.store.select(collectionFeature.selectCollection);
  authUser$ = this.store.select(authFeature.selectUser);
  tops$ = this.store.select(collectionFeature.selectTops);
  isLoaded$ = this.store.select(collectionFeature.selectIsTopsLoaded);
  subs: Subscription = new Subscription();

  constructor(
    private store: Store,
    private SEOSrv: SEOService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.store.dispatch(collectionActions.loadTops());

    // obtiene los datos de la colección
    let colSub = this.collection$
      .pipe(
        filter((col) => col != null),
        tap((col) => {
          this.SEOSrv.set({
            title: `TOP ítems en ${col?.name} - ${col?.publisher.data.name} (${col?.year}) - Intercambia Láminas`,
            description: `Revisa los ítems clasificados por dificultad en el álbum/colección ${col?.name} de ${col?.publisher.data.name} (${col?.year}).`,
            url: `${environment.appUrl}/c/${new SlugifyPipe().transform(
              col?.name + ' ' + col?.publisher.data.name
            )}/${col?.id}/tops`,
            isCanonical: true,
          });
        })
      )
      .subscribe(() => this.cdr.markForCheck());
    this.subs.add(colSub);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
