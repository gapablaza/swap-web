import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { Collection, DEFAULT_COLLECTION_IMG } from 'src/app/core';
import { SlugifyPipe } from '../../../shared/pipes/slugify.pipe';

@Component({
  selector: 'app-list-collections',
  templateUrl: './list-collections.component.html',
  standalone: true,
  imports: [RouterLink, LazyLoadImageModule, SlugifyPipe],
})
export class ListCollectionsComponent {
  @Input() collections: Collection[] = [];
  defaultCollectionImage = DEFAULT_COLLECTION_IMG;
}
