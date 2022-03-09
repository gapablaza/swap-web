import { Component, OnInit } from '@angular/core';

import { Collection, CollectionService, Item } from 'src/app/core';
import { CollectionOnlyService } from '../collection-only.service';

@Component({
  selector: 'app-collection-profile',
  templateUrl: './collection-profile.component.html',
  styleUrls: ['./collection-profile.component.scss']
})
export class CollectionProfileComponent implements OnInit {
  collection: Collection = {} as Collection;
  userWishing: Item[] = [];
  userTrading: Item[] = [];

  constructor(
    private colSrv: CollectionService,
    private colOnlySrv: CollectionOnlyService,
  ) { }

  ngOnInit(): void {
    // this.route.paramMap
    //   .pipe(
    //     switchMap(paramMap => {
    //       this.collectionId = Number(paramMap.get('id'));
    //       return this.colSrv.get(this.collectionId);
    //     })
    //   )
    //   .subscribe(col => {
    //     console.log(col);
    //     this.collection = col;

    //     // si el usuario tiene esta colección se obtienen sus listas
    //     if (!col.collecting) { //CAMBIAR
    //       this.colSrv.getItems(this.collectionId)
    //         .subscribe(items => {
    //           items.forEach(item => {
    //             if (item.wishlist) { this.userWishing.push(item); }
    //             if (item.tradelist) { this.userTrading.push(item); }
    //           });
    //         });
    //     }
    //   });

    this.collection = this.colOnlySrv.getCurrentCollection();
    console.log('from CollectionProfileComponent', this.collection);

    // si el usuario tiene esta colección se obtienen sus listas
    if (!this.collection.collecting) { //CAMBIAR
      this.colSrv.getItems(this.collection.id)
        .subscribe(items => {
          items.forEach(item => {
            if (item.wishlist) { this.userWishing.push(item); }
            if (item.tradelist) { this.userTrading.push(item); }
          });
        });
    }
  }
}
