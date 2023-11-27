import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { take } from 'rxjs';

import { Collection, Item, User, UserService } from 'src/app/core';
import { SlugifyPipe } from '../../../shared/pipes/slugify.pipe';
import { SanitizeHtmlPipe } from '../../../shared/pipes/sanitize-html.pipe';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf, NgFor, DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-collection-details',
  templateUrl: './user-collection-details.component.html',
  styleUrls: ['./user-collection-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatDialogModule,
    NgIf,
    MatProgressSpinnerModule,
    NgFor,
    MatButtonModule,
    RouterLink,
    DatePipe,
    SanitizeHtmlPipe,
    SlugifyPipe,
  ],
})
export class UserCollectionDetailsComponent implements OnInit {
  user: User = {} as User;
  collection: Collection = {} as Collection;
  userWishing: Item[] = [];
  userTrading: Item[] = [];
  isLoaded = false;

  constructor(
    private userSrv: UserService,
    private cdr: ChangeDetectorRef,
    private dialogRef: MatDialogRef<UserCollectionDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.user = data.user;
    this.collection = data.collection;
  }

  ngOnInit(): void {
    this.userSrv
      .getCollectionInfo(this.user.id, this.collection.id)
      .pipe(take(1))
      .subscribe((col) => {
        this.collection = col;
        this.userWishing =
          col.userData?.wishlist?.sort(
            (a, b) => (a.position || 0) - (b.position || 0)
          ) || [];
        this.userTrading =
          col.userData?.tradelist?.sort(
            (a, b) => (a.position || 0) - (b.position || 0)
          ) || [];

        this.isLoaded = true;
        this.cdr.markForCheck();
      });
  }

  onClose() {
    this.dialogRef.close();
  }
}
