import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Collection, DEFAULT_COLLECTION_IMG, Pagination } from 'src/app/core';

@Component({
  selector: 'app-search-collection',
  templateUrl: './search-collection.component.html',
  styleUrls: ['./search-collection.component.scss']
})
export class SearchCollectionComponent implements OnInit {
  @Input() collections: Collection[] = [];
  @Input() paginator!: Pagination;
  @Output() onPageSelected = new EventEmitter<number>();
  showedCollections: Collection[] = [];
  defaultCollectionImage = DEFAULT_COLLECTION_IMG;
  pageSelected = 1;

  constructor() { }

  ngOnInit(): void {
    this.pageSelected = this.paginator.current_page;
    this.showedCollections = [...this.collections];
  }

  trackByCollection(index: number, item: Collection): number {
    return item.id;
  }

  // onSort() {
  //   this.router.navigate(['/explore/collections'], {
  //     queryParams: {
  //       page: this.pageSelected,
  //       sortBy: this.sortOptionSelected,
  //     },
  //   });
  // }

  onPageChange(e: string) {
    this.pageSelected = parseInt(e);
    this.onPageSelected.emit(this.pageSelected);
  }
}
