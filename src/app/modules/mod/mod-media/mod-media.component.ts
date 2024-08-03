import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe, AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';

import { environment } from 'src/environments/environment';
import { SlugifyPipe } from '../../../shared/pipes/slugify.pipe';
import { modFeature } from '../store/mod.state';
import { modActions } from '../store/mod.actions';

@Component({
  selector: 'app-mod-media',
  templateUrl: './mod-media.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    DatePipe,

    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,

    SlugifyPipe,
  ],
})
export class ModMediaComponent implements OnInit {
  medias$ = this.store.select(modFeature.selectMedias);
  isLoaded$ = this.store.select(modFeature.selectIsMediaLoaded);
  isProcessing$ = this.store.select(modFeature.selectIsProcessing);
  baseForModImageUrl = `https://res.cloudinary.com/${environment.cloudinary.cloudName}/image/upload/v1/${environment.cloudinary.site}/collectionMedia/`;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(modActions.loadMedia());
  }

  onSanctionImage(mediaId: number, sanctionId: 2 | 3) {
    this.store.dispatch(modActions.sanctionMedia({ mediaId, sanctionId }));
  }
}
