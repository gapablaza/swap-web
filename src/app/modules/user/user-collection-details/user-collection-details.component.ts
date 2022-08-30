import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first } from 'rxjs';

import { Collection, Item, User, UserService } from 'src/app/core';

@Component({
  selector: 'app-user-collection-details',
  templateUrl: './user-collection-details.component.html',
  styleUrls: ['./user-collection-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    @Inject(MAT_DIALOG_DATA) data:any
  ) {
    this.user = data.user;
    this.collection = data.collection;
  }

  ngOnInit(): void {
    this.userSrv.getCollectionInfo(this.user.id, this.collection.id)
      .pipe(first())
      .subscribe(col => {
        this.collection = col;
        this.userWishing = col.userData?.wishlist || [];
        this.userTrading = col.userData?.tradelist || [];

        this.isLoaded = true;
        this.cdr.markForCheck();
      });
  }

  onClose() {
    this.dialogRef.close();
  }
}
