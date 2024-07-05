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

import { Media, SEOService } from 'src/app/core';
import { environment } from 'src/environments/environment';
import { SlugifyPipe } from 'src/app/shared';
import { collectionFeature } from '../store/collection.state';
import { collectionActions } from '../store/collection.actions';
import { CollectionSummaryComponent } from '../collection-summary/collection-summary.component';
import { CollectionMediaGridComponent } from './collection-media-grid.component';
import { CollectionMediaModComponent } from './collection-media-mod.component';

@Component({
  selector: 'app-collection-media',
  templateUrl: './collection-media.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    AsyncPipe,
    CollectionSummaryComponent,
    CollectionMediaGridComponent,
    CollectionMediaModComponent,
  ],
})
export class CollectionMediaComponent implements OnInit, OnDestroy {
  medias$ = this.store.select(collectionFeature.selectMediaPublished);
  imagesForMod$ = this.store.select(
    collectionFeature.selectMediaForModFromAuthUser
  );
  collection$ = this.store.select(collectionFeature.selectCollection);
  isLoaded$ = this.store.select(collectionFeature.selectIsMediaLoaded);
  isProcessing$ = this.store.select(collectionFeature.selectIsProcessing);

  subs: Subscription = new Subscription();

  constructor(
    private store: Store,
    private SEOSrv: SEOService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.store.dispatch(collectionActions.loadMedia());

    let colSub = this.collection$
      .pipe(
        filter((col) => col != null),
        tap((col) => {
          this.SEOSrv.set({
            title: `Media compartida asociada a ${col?.name} - ${col?.publisher.data.name} (${col?.year}) - Intercambia Láminas`,
            description: `Revisa los distintos elementos multimedia subidos por los usuarios, asociados al álbum/colección ${col?.name} de ${col?.publisher.data.name} (${col?.year}).`,
            url: `${environment.appUrl}/c/${new SlugifyPipe().transform(
              col?.name + ' ' + col?.publisher.data.name
            )}/${col?.id}/media`,
            isCanonical: true,
          });
        })
      )
      .subscribe(() => {
        this.cdr.markForCheck();
      });
    this.subs.add(colSub);
  }

  newImage() {
    this.store.dispatch(collectionActions.addImage());
  }

  deleteImage(mediaId: number) {
    if (!mediaId || isNaN(mediaId)) return;

    this.store.dispatch(collectionActions.removeImage({ mediaId }));
  }

  toggleLike(item: Media) {
    this.store.dispatch(
      collectionActions.toggleMediaLike({
        mediaId: item.id,
        likes: !item.likes,
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
