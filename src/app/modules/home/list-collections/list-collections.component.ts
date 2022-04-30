import { Component, Input, OnInit } from '@angular/core';
import { Collection, DEFAULT_COLLECTION_IMG } from 'src/app/core';

@Component({
  selector: 'app-list-collections',
  templateUrl: './list-collections.component.html',
  styleUrls: ['./list-collections.component.scss']
})
export class ListCollectionsComponent implements OnInit {
  @Input() collections: Collection[] = [] ;
  defaultCollectionImage = DEFAULT_COLLECTION_IMG;

  constructor() { }

  ngOnInit(): void {
  }

}
