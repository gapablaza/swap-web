import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Collection, DEFAULT_COLLECTION_IMG } from 'src/app/core';
import { SlugifyPipe } from '../../pipes/slugify.pipe';

@Component({
  selector: 'app-collection-item',
  templateUrl: './collection-item.component.html',
  standalone: true,
  imports: [
    RouterLink,

    SlugifyPipe,
  ],
})
export class CollectionItemComponent {
  collection_ = input<Collection>({} as Collection, { alias: 'collection' });
  priority = input<boolean>(false);

  defaultCollectionImage = DEFAULT_COLLECTION_IMG;
}
