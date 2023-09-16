import { Component, Input, OnInit } from '@angular/core';

import { Collection, DEFAULT_COLLECTION_IMG } from 'src/app/core';
import { SlugifyPipe } from '../../pipes/slugify.pipe';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-collection-item',
    templateUrl: './collection-item.component.html',
    styleUrls: ['./collection-item.component.scss'],
    standalone: true,
    imports: [RouterLink, LazyLoadImageModule, SlugifyPipe]
})
export class CollectionItemComponent implements OnInit {
  @Input() collection: Collection = {} as Collection;
  defaultCollectionImage = DEFAULT_COLLECTION_IMG;
  
  constructor() { }

  ngOnInit(): void {
  }

}
