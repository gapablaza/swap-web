import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Collection, DEFAULT_COLLECTION_IMG, Pagination } from 'src/app/core';

@Component({
  selector: 'app-search-collection',
  templateUrl: './search-collection.component.html',
  styleUrls: ['./search-collection.component.scss'],
})
export class SearchCollectionComponent implements OnInit {
  @Input() collections: Collection[] = [];
  @Input() paginator!: Pagination;
  @Output() onPageSelected = new EventEmitter<number>();
  @Output() onOrderSelected = new EventEmitter<string>();
  showedCollections: Collection[] = [];
  defaultCollectionImage = DEFAULT_COLLECTION_IMG;
  pageSelected = 1;

  colSortOptionSelected = 'relevance';
  colSortOptions = [
    {
      selectName: 'Mejor resultado',
      selectValue: 'relevance',
    },
    {
      selectName: 'Últimos publicados',
      selectValue: 'published-DESC',
    },
    {
      selectName: 'Más antiguos',
      selectValue: 'published-ASC',
    },
    {
      selectName: 'Nombre A-Z',
      selectValue: 'title-ASC',
    },
    {
      selectName: 'Nombre Z-A',
      selectValue: 'title-DESC',
    },
  ];

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    let actualParams = this.route.snapshot.queryParams;
    let tempSort = actualParams['sortBy'];
    let tempIndex = this.colSortOptions.findIndex(
      (sort) => sort.selectValue == tempSort
    );
    this.colSortOptionSelected =
      tempIndex >= 0 ? this.colSortOptions[tempIndex].selectValue : 'relevance';
    this.pageSelected = this.paginator.current_page;
    this.showedCollections = [...this.collections];
  }

  trackByCollection(index: number, item: Collection): number {
    return item.id;
  }

  onCollectionSort() {
    this.onOrderSelected.emit(this.colSortOptionSelected);
  }

  onPageChange(e: string) {
    this.pageSelected = parseInt(e);
    this.onPageSelected.emit(this.pageSelected);
  }
}
