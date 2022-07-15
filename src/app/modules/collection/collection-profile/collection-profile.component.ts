import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component, OnInit } from '@angular/core';
import { filter, first } from 'rxjs';

import {
  AuthService,
  Collection,
  CollectionService,
  DEFAULT_COLLECTION_IMG,
  Item,
  User,
} from 'src/app/core';
import { CollectionOnlyService } from '../collection-only.service';

@Component({
  selector: 'app-collection-profile',
  templateUrl: './collection-profile.component.html',
  styleUrls: ['./collection-profile.component.scss'],
})
export class CollectionProfileComponent implements OnInit {
  collection: Collection = {} as Collection;
  authUser: User = {} as User;
  defaultCollectionImage = DEFAULT_COLLECTION_IMG;
  userWishing: Item[] = [];
  userTrading: Item[] = [];
  isLoaded = false;

  constructor(
    private colSrv: CollectionService,
    private colOnlySrv: CollectionOnlyService,
    private authSrv: AuthService
  ) {}

  ngOnInit(): void {
    registerLocaleData(es);

    // get possible auth User
    this.authSrv.authUser
      .pipe(filter((user) => user.id != null))
      .subscribe((user) => {
        this.authUser = user;
      });

    // obtiene los datos de la colección
    this.colOnlySrv.collection$
      .pipe(filter((col) => col.id != null))
      .subscribe((col) => {
        this.collection = col;
        this.isLoaded = true;

        // si el usuario tiene esta colección se obtienen sus listas
        if (this.collection.collecting) {
          this.colSrv
            .getItems(this.collection.id)
            .pipe(first())
            .subscribe((items) => {
              items.forEach((item) => {
                if (item.wishlist) {
                  this.userWishing.push(item);
                }
                if (item.tradelist) {
                  this.userTrading.push(item);
                }
              });
            });
        }
      });
    console.log('from CollectionProfileComponent');
  }
}
