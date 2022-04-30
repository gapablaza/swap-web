import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Collection, Item, User, UserService } from 'src/app/core';

@Component({
  selector: 'app-user-collection-details',
  templateUrl: './user-collection-details.component.html',
  styleUrls: ['./user-collection-details.component.scss']
})
export class UserCollectionDetailsComponent implements OnInit {
  user: User = {} as User;
  collection: Collection = {} as Collection;
  userWishing: Item[] = [];
  userTrading: Item[] = [];
  isLoaded = false;

  constructor(
    private userSrv: UserService,
    private dialogRef: MatDialogRef<UserCollectionDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) data:any
  ) {
    this.user = data.user;
    this.collection = data.collection;
  }

  ngOnInit(): void {
    this.userSrv.getCollectionInfo(this.user.id, this.collection.id)
      .subscribe(data => {
        console.log(data);
        this.collection = data.info;
        this.userWishing = data.wishlist;
        this.userTrading = data.tradelist;

        this.isLoaded = true;
      });
  }

  onClose() {
    this.dialogRef.close();
  }

}
