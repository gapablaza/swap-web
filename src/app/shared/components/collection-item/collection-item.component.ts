import { Component, Input, OnInit } from '@angular/core';

import { Collection, DEFAULT_COLLECTION_IMG } from 'src/app/core';

@Component({
  selector: 'app-collection-item',
  templateUrl: './collection-item.component.html',
  styleUrls: ['./collection-item.component.scss']
})
export class CollectionItemComponent implements OnInit {
  @Input() collection: Collection = {} as Collection;
  defaultCollectionImage = DEFAULT_COLLECTION_IMG;
  
  constructor() { }

  ngOnInit(): void {
  }

}
