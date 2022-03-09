import { Component, Input, OnInit } from '@angular/core';
import { Collection } from 'src/app/core';

@Component({
  selector: 'app-list-collections',
  templateUrl: './list-collections.component.html',
  styleUrls: ['./list-collections.component.scss']
})
export class ListCollectionsComponent implements OnInit {
  @Input() collections: Collection[] = [] ;

  constructor() { }

  ngOnInit(): void {
  }

}
