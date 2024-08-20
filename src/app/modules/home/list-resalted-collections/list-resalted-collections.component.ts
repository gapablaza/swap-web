import { Component, Input } from '@angular/core';

import { Collection, DEFAULT_COLLECTION_IMG } from 'src/app/core';
import { CollectionItemComponent } from '../../../shared/components/collection-item/collection-item.component';

@Component({
  selector: 'app-list-resalted-collections',
  templateUrl: './list-resalted-collections.component.html',
  standalone: true,
  imports: [CollectionItemComponent],
})
export class ListResaltedCollectionsComponent {
  @Input() collections: Collection[] = [];
  defaultCollectionImage = DEFAULT_COLLECTION_IMG;
}
