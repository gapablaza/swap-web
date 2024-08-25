import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Collection, DEFAULT_COLLECTION_IMG } from 'src/app/core';
import { SlugifyPipe } from '../../../shared/pipes/slugify.pipe';

@Component({
  selector: 'app-list-collections',
  templateUrl: './list-collections.component.html',
  standalone: true,
  imports: [RouterLink, SlugifyPipe],
})
export class ListCollectionsComponent {
  @Input() collections: Collection[] = [];
  defaultCollectionImage = DEFAULT_COLLECTION_IMG;
}
