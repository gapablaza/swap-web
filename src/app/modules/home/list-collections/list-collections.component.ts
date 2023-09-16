import { Component, Input, OnInit } from '@angular/core';
import { Collection, DEFAULT_COLLECTION_IMG } from 'src/app/core';
import { SlugifyPipe } from '../../../shared/pipes/slugify.pipe';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-list-collections',
    templateUrl: './list-collections.component.html',
    styleUrls: ['./list-collections.component.scss'],
    standalone: true,
    imports: [NgFor, RouterLink, LazyLoadImageModule, SlugifyPipe]
})
export class ListCollectionsComponent implements OnInit {
  @Input() collections: Collection[] = [] ;
  defaultCollectionImage = DEFAULT_COLLECTION_IMG;

  constructor() { }

  ngOnInit(): void {
  }

}
