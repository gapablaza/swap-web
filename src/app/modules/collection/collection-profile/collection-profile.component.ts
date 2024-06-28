import { registerLocaleData, AsyncPipe } from '@angular/common';
import es from '@angular/common/locales/es';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { combineLatest, filter, Subscription, tap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';

import { SEOService } from 'src/app/core';
import { SlugifyPipe, UIService } from 'src/app/shared';
import { environment } from 'src/environments/environment';
import { collectionFeature } from '../store/collection.state';
import { collectionActions } from '../store/collection.actions';
import { authFeature } from '../../auth/store/auth.state';
import { CollectionProfileHeaderComponent } from './collection-profile-header.component';
import { CollectionProfileSectionsComponent } from './collection-profile-sections.component';
import { CollectionProfileFooterComponent } from './collection-profile-footer.component';
import { CollectionProfileTradesComponent } from './collection-profile-trades.component';

@Component({
  selector: 'app-collection-profile',
  templateUrl: './collection-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatIconModule,
    AsyncPipe,
    CollectionProfileHeaderComponent,
    CollectionProfileSectionsComponent,
    CollectionProfileFooterComponent,
    CollectionProfileTradesComponent,
  ],
})
export class CollectionProfileComponent implements OnInit, OnDestroy {
  collection$ = this.store.select(collectionFeature.selectCollection);
  lastCollectors$ = this.store.select(collectionFeature.selectLastCollectors);
  lastMedia$ = this.store.select(collectionFeature.selectLastMedia);
  items$ = this.store.select(collectionFeature.selectItems);
  isAuth$ = this.store.select(authFeature.selectIsAuth);

  isProcessing$ = this.store.select(collectionFeature.selectIsProcessing);
  isLoaded$ = this.store.select(collectionFeature.selectIsLoaded);
  subs: Subscription = new Subscription();

  constructor(
    private store: Store,
    private SEOSrv: SEOService,
    private uiSrv: UIService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    registerLocaleData(es);

    let dataSub = combineLatest([this.collection$, this.isLoaded$])
      .pipe(
        filter(([, isLoaded]) => isLoaded),
        tap(([col]) => {
          this.SEOSrv.set({
            title: `${col?.name} - ${col?.publisher.data.name} (${col?.year}) - Intercambia Láminas`,
            description: `Marca tus repetidas/faltantes del álbum/colección ${col?.name} de ${col?.publisher.data.name} (${col?.year}) para encontrar con quien poder cambiar. Son ${col?.items} ítems a coleccionar (láminas / stickers / figuritas / pegatinas / cromos / estampas / barajitas).`,
            url: `${environment.appUrl}/c/${new SlugifyPipe().transform(
              col?.name + ' ' + col?.publisher.data.name
            )}/${col?.id}`,
            isCanonical: true,
          });
        }),
        filter(([col]) => {
          if (col && col?.userData && col?.userData?.collecting) {
            return true;
          } else {
            return false;
          }
        })
      )
      .subscribe(() => {
        this.store.dispatch(collectionActions.loadItems());
        this.cdr.markForCheck();
      });
    this.subs.add(dataSub);
  }

  onAdd() {
    this.store.dispatch(collectionActions.add());
  }

  onShare(): void {
    this.uiSrv.shareUrl();
  }

  onComplete(completed: boolean) {
    this.store.dispatch(collectionActions.toggleCompleted({ completed }));
  }

  onConfirmDelete() {
    this.store.dispatch(collectionActions.remove());
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
