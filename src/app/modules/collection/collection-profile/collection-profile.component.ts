import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component, OnInit } from '@angular/core';

import { Collection, CollectionService, Item } from 'src/app/core';
import { CollectionOnlyService } from '../collection-only.service';

@Component({
  selector: 'app-collection-profile',
  templateUrl: './collection-profile.component.html',
  styleUrls: ['./collection-profile.component.scss'],
})
export class CollectionProfileComponent implements OnInit {
  collection: Collection = {} as Collection;
  userWishing: Item[] = [];
  userTrading: Item[] = [];
  isLoaded = false;

  constructor(
    private colSrv: CollectionService,
    private colOnlySrv: CollectionOnlyService
  ) {}

  ngOnInit(): void {
    registerLocaleData(es);
    this.colOnlySrv.collection$.subscribe((col) => {
      if (col.id) {
        this.collection = col;
        this.isLoaded = true;

        // si el usuario tiene esta colección se obtienen sus listas
        if (this.collection.collecting) {
          this.colSrv.getItems(this.collection.id).subscribe((items) => {
            items.forEach((item) => {
              if (item.wishlist) { this.userWishing.push(item); }
              if (item.tradelist) { this.userTrading.push(item); }
            });
          });
        }
      }
    });
    console.log('from CollectionProfileComponent', this.collection);
  }
}
