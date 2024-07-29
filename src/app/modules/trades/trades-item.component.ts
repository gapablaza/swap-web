import { AsyncPipe, DecimalPipe, NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import {
  DEFAULT_COLLECTION_IMG,
  DEFAULT_USER_PROFILE_IMG,
  TradesUser,
} from 'src/app/core';
import { DaysSinceLoginDirective, SlugifyPipe } from 'src/app/shared';

@Component({
  selector: 'app-trades-item',
  templateUrl: './trades-item.component.html',
  standalone: true,
  imports: [
    RouterLink,
    NgClass,
    AsyncPipe,
    DecimalPipe,

    MatButtonModule,
    MatIconModule,

    LazyLoadImageModule,
    DaysSinceLoginDirective,
    SlugifyPipe,
  ],
})
export class TradesItemComponent {
  user = input.required<TradesUser>();
  authUserPro = input<boolean>(false);

  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  defaultCollectionImage = DEFAULT_COLLECTION_IMG;

  get userData() {
    return this.user().userData;
  }
}
