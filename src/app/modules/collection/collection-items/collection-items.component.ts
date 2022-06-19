import { Component, OnInit } from '@angular/core';
import { concatMap, of } from 'rxjs';

import { Collection, CollectionService, DEFAULT_COLLECTION_IMG, Item } from 'src/app/core';
import { CollectionOnlyService } from '../collection-only.service';

@Component({
  selector: 'app-collection-items',
  templateUrl: './collection-items.component.html',
  styleUrls: ['./collection-items.component.scss']
})
export class CollectionItemsComponent implements OnInit {
  collection: Collection = {} as Collection;
  defaultCollectionImage = DEFAULT_COLLECTION_IMG;
  items: Item[] = [];
  // displayedColumns: string[] = ['name', 'description', 'difficulty'];
  displayedColumns: string[] = ['name', 'description'];
  isLoaded = false;

  constructor(
    private colSrv: CollectionService,
    private colOnlySrv: CollectionOnlyService,
  ) { }

  ngOnInit(): void {
    this.colOnlySrv.collection$
      .pipe(
        concatMap(col => {
          if (col.id) {
            this.collection = col;
            return this.colSrv.getItems(col.id);
          } else {
            return of([]);
          }
        })
      )
      .subscribe(items => {
        this.items = items;
        if (this.collection.id) {
          this.isLoaded = true;
        }
      });
      
    console.log('from CollectionItemsComponent', this.collection);
  }
}
