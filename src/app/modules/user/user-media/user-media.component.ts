import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subscription, tap } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Media, SEOService } from 'src/app/core';
import { userFeature } from '../store/user.state';
import { userActions } from '../store/user.actions';
import { UserSummaryComponent } from '../user-summary/user-summary.component';
import { UserMediaGridComponent } from './user-media-grid.component';

@Component({
  selector: 'app-user-media',
  templateUrl: './user-media.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    MatProgressSpinnerModule,

    UserSummaryComponent,
    UserMediaGridComponent,
  ],
})
export class UserMediaComponent implements OnInit, OnDestroy {
  user$ = this.store.select(userFeature.selectUser);
  images = this.store.selectSignal(userFeature.selectImages);

  isLoaded$ = this.store.select(userFeature.selectIsMediaLoaded);
  subs: Subscription = new Subscription();

  constructor(
    private store: Store,
    private SEOSrv: SEOService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.store.dispatch(userActions.loadUserMedia());

    let mediaSub = this.user$
      .pipe(
        tap((user) => {
          this.SEOSrv.set({
            title: `Elementos multimedia publicados por ${user.displayName} (ID ${user.id}) - Intercambia Láminas`,
            description: `Revisa el detalle de los elementos multimedia publicados por ${user.displayName} (ID ${user.id}).`,
            isCanonical: true,
          });
        })
      )
      .subscribe(() => {
        this.cdr.markForCheck();
      });
    this.subs.add(mediaSub);
  }

  toggleLike(item: Media) {
    this.store.dispatch(
      userActions.toggleMediaLike({ mediaId: item.id, likes: !item.likes })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
