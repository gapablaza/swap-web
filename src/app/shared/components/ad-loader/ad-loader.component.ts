import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { filter, map, switchMap, tap } from 'rxjs';

import { UIService } from '../../ui.service';
import { AdsModule } from '../../ads.module';
import { authFeature } from 'src/app/modules/auth/store/auth.state';

@Component({
  selector: 'app-ad-loader',
  template: `
    @if (shouldShowAd()) {
    <ng-container>
      <ng-adsense
        [adSlot]="adSlot()"
        [adFormat]="adFormat()"
        [display]="display()"
        [fullWidthResponsive]="fullWidthResponsive()"
        [className]="className()"
      >
      </ng-adsense>
    </ng-container>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, AdsModule],
})
export class AdLoaderComponent {
  adSlot = input.required<number>();
  adFormat = input('auto');
  display = input('block');
  fullWidthResponsive = input(true);
  className = input<'bga-hor' | 'bga-section-vert'>('bga-hor');

  shouldShowAd = toSignal(
    this.store.select(authFeature.selectUser).pipe(
      filter((user) => !user.id || user.accountTypeId === 1),
      switchMap((user) =>
        this.uiSrv.isAdsSenseLoaded$.pipe(
          tap((isLoaded) => {
            if (!isLoaded) {
              this.uiSrv
                .loadAds()
                .catch(() => console.error('Failed to load Google Ads script'));
            }
          }),
          filter((isLoaded) => isLoaded),
          map(() => user)
        )
      ),
      map(() => true)
    ),
    { initialValue: false }
  );

  constructor(private uiSrv: UIService, private store: Store) {}
}
