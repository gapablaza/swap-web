import { Component, Input, OnInit } from '@angular/core';

import { Collection, DEFAULT_COLLECTION_IMG } from 'src/app/core';
import { CollectionItemComponent } from '../../../shared/components/collection-item/collection-item.component';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-list-resalted-collections',
    templateUrl: './list-resalted-collections.component.html',
    styleUrls: ['./list-resalted-collections.component.scss'],
    standalone: true,
    imports: [NgFor, CollectionItemComponent]
})
export class ListResaltedCollectionsComponent implements OnInit {
  @Input() collections: Collection[] = [] ;
  defaultCollectionImage = DEFAULT_COLLECTION_IMG;

  constructor() { }

  ngOnInit(): void {
  }

}
