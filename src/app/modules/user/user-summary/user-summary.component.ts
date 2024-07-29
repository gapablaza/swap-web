import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';

import { DEFAULT_USER_PROFILE_IMG } from 'src/app/core';
import { UIService } from 'src/app/shared';
import { userFeature } from '../store/user.state';
import { AdLoaderComponent } from 'src/app/shared/components/ad-loader/ad-loader.component';

@Component({
  selector: 'app-user-summary',
  templateUrl: './user-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterLink,
    AsyncPipe,

    MatButtonModule,
    MatIconModule,
    LazyLoadImageModule,

    AdLoaderComponent,
  ],
})
export class UserSummaryComponent {
  @Input() showBackButton = false;
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;

  user$ = this.store.select(userFeature.selectUser);
  isLoaded$ = this.store.select(userFeature.selectIsLoaded);

  constructor(private store: Store, private uiSrv: UIService) {}

  onShare(): void {
    this.uiSrv.shareUrl();
  }
}
