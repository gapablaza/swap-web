import { Component, OnInit } from '@angular/core';

import { Collection, CollectionService, Item } from 'src/app/core';
import { CollectionOnlyService } from '../collection-only.service';

@Component({
  selector: 'app-collection-items',
  templateUrl: './collection-items.component.html',
  styleUrls: ['./collection-items.component.scss']
})
export class CollectionItemsComponent implements OnInit {
  collection!: Collection;
  items: Item[] = [];
  displayedColumns: string[] = ['name', 'description', 'difficulty'];

  constructor(
    private colSrv: CollectionService,
    private colOnlySrv: CollectionOnlyService,
  ) { }

  ngOnInit(): void {
    this.collection = this.colOnlySrv.getCurrentCollection();
    console.log('from CollectionItemsComponent', this.collection);
    this.colSrv.getItems(this.collection.id).subscribe(data => {
      this.items = data;
    });
  }
}
