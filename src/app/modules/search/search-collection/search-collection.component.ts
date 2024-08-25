import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgClass, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { Collection, DEFAULT_COLLECTION_IMG, Pagination } from 'src/app/core';
import { SlugifyPipe } from '../../../shared/pipes/slugify.pipe';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';

@Component({
  selector: 'app-search-collection',
  templateUrl: './search-collection.component.html',
  standalone: true,
  imports: [
    NgClass,
    RouterLink,
    FormsModule,
    DecimalPipe,

    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,

    SlugifyPipe,
    PaginationComponent,
  ],
})
export class SearchCollectionComponent implements OnInit {
  collections = input.required<Collection[]>();
  paginator = input.required<Pagination>();
  @Output() onPageSelected = new EventEmitter<number>();
  @Output() onOrderSelected = new EventEmitter<string>();

  defaultCollectionImage = DEFAULT_COLLECTION_IMG;
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

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    let actualParams = this.route.snapshot.queryParams;
    let tempIndex = this.colSortOptions.findIndex(
      (sort) => sort.selectValue == actualParams['sortBy']
    );
    this.colSortOptionSelected =
      tempIndex >= 0 ? this.colSortOptions[tempIndex].selectValue : 'relevance';
  }

  onCollectionSort() {
    this.onOrderSelected.emit(this.colSortOptionSelected);
  }

  onPageChange(e: number) {
    this.onPageSelected.emit(e);
  }
}
