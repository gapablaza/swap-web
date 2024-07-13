import { NgClass } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { Publisher } from 'src/app/core';
import { SlugifyPipe } from 'src/app/shared';

interface sortOption {
  selectName: string;
  selectValue: string;
  arrayFields: (keyof Publisher)[];
  arrayOrders: string[];
}

@Component({
  selector: 'app-publisher-all-list',
  templateUrl: './publisher-all-list.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    LazyLoadImageModule,
    SlugifyPipe,
  ],
})
export class PublisherAllListComponent {
  publishers = input.required<Publisher[]>();

  searchText = signal('');
  showFilters = true;
  sortOptionSelected = signal('collections');
  sortOptions = [
    {
      selectName: 'Nº de colecciones',
      selectValue: 'collections',
      arrayFields: ['collections', 'name'] as (keyof Publisher)[],
      arrayOrders: ['desc', 'asc'],
    },
    {
      selectName: 'Nombre',
      selectValue: 'name',
      arrayFields: ['name'] as (keyof Publisher)[],
      arrayOrders: ['asc'],
    },
  ];

  managedPublishers = computed(() => {
    const filterText = this.searchText();
    const sortOption = this.sortOptions.find(
      (option) => option.selectValue === this.sortOptionSelected()
    );

    let filteredPublishers = this.publishers().filter((p) =>
      this.applyFilter(p, filterText)
    );

    if (sortOption) {
      filteredPublishers.sort((a, b) => this.applySort(a, b, sortOption));
    }

    return filteredPublishers;
  });

  applyFilter(publisher: Publisher, searchText: string): boolean {
    if (searchText.length <= 1) {
      return true;
    }
    return publisher.name.toLowerCase().includes(searchText.toLowerCase());
  }

  applySort(a: Publisher, b: Publisher, sortOption: sortOption): number {
    for (let i = 0; i < sortOption.arrayFields.length; i++) {
      const field = sortOption.arrayFields[i];
      const order = sortOption.arrayOrders[i];
      let comparison = 0;

      // Determine comparison based on field type
      if (typeof a[field] === 'string' && typeof b[field] === 'string') {
        comparison = (a[field] as string).localeCompare(b[field] as string);
      } else {
        comparison = (a[field] as number) - (b[field] as number);
      }

      if (order === 'desc') {
        comparison = comparison * -1;
      }

      if (comparison !== 0) {
        return comparison;
      }
    }
    return 0;
  }

  onClearFilter() {
    this.searchText.set('');
  }

  onSort(sortOption: string) {
    this.sortOptionSelected.set(sortOption);
  }
}
