import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgClass, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

import { DEFAULT_USER_PROFILE_IMG, Pagination, User } from 'src/app/core';
import { SanitizeHtmlPipe } from '../../../shared/pipes/sanitize-html.pipe';
import { DaysSinceLoginDirective } from '../../../shared/directives/days-since-login.directive';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';

@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  standalone: true,
  imports: [
    NgClass,
    RouterLink,
    FormsModule,
    DecimalPipe,

    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,

    DaysSinceLoginDirective,
    SanitizeHtmlPipe,
    PaginationComponent,
  ],
})
export class SearchUserComponent implements OnInit {
  users = input.required<User[]>();
  paginator = input.required<Pagination>();
  @Output() onPageSelected = new EventEmitter<number>();
  @Output() onOrderSelected = new EventEmitter<string>();

  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  userSortOptionSelected = 'relevance';
  userSortOptions = [
    {
      selectName: 'Mejor resultado',
      selectValue: 'relevance',
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
    let tempIndex = this.userSortOptions.findIndex(
      (sort) => sort.selectValue == actualParams['sortBy']
    );
    this.userSortOptionSelected =
      tempIndex >= 0
        ? this.userSortOptions[tempIndex].selectValue
        : 'relevance';
  }

  onCollectionSort() {
    this.onOrderSelected.emit(this.userSortOptionSelected);
  }

  onPageChange(e: number) {
    this.onPageSelected.emit(e);
  }
}
