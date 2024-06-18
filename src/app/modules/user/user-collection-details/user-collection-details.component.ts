import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe, AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { combineLatest, filter, map, take } from 'rxjs';

import { Collection, Item } from 'src/app/core';
import { SlugifyPipe } from '../../../shared/pipes/slugify.pipe';
import { SanitizeHtmlPipe } from '../../../shared/pipes/sanitize-html.pipe';
import { userFeature } from '../store/user.state';
import { userActions } from '../store/user.actions';

@Component({
  selector: 'app-user-collection-details',
  templateUrl: './user-collection-details.component.html',
  styleUrls: ['./user-collection-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatDialogModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    RouterLink,
    DatePipe,
    SanitizeHtmlPipe,
    SlugifyPipe,
    AsyncPipe,
  ],
})
export class UserCollectionDetailsComponent implements OnInit {
  user$ = this.store.select(userFeature.selectUser);
  collection$ = this.store.select(userFeature.selectCollectionDetails);
  collection: Collection = {} as Collection;
  userWishing: Item[] = [];
  userTrading: Item[] = [];
  isLoaded$ = this.store.select(userFeature.selectIsCollectionDetailsLoaded);

  constructor(
    private store: Store,
    private cdr: ChangeDetectorRef,
    private dialogRef: MatDialogRef<UserCollectionDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.collection = data.collection;
  }

  ngOnInit(): void {
    this.store.dispatch(
      userActions.loadUserCollectionDetails({ collection: this.collection })
    );

    combineLatest([this.collection$, this.user$])
      .pipe(
        filter(([col]) => col !== null),
        take(1),
        map(([col, user]) => col)
      )
      .subscribe((col) => {
        if (col !== null) {
          this.collection = col;
          this.userWishing =
            [...(col.userData?.wishlist || [])].sort(
              (a, b) => (a.position || 0) - (b.position || 0)
            ) || [];
          this.userTrading =
            [...(col.userData?.tradelist || [])].sort(
              (a, b) => (a.position || 0) - (b.position || 0)
            ) || [];
        }

        this.cdr.markForCheck();
      });
  }

  onClose() {
    this.dialogRef.close();
  }
}
