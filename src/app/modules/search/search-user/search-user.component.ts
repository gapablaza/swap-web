import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DEFAULT_USER_PROFILE_IMG, Pagination, User } from 'src/app/core';

@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  styleUrls: ['./search-user.component.scss'],
})
export class SearchUserComponent implements OnInit {
  @Input() users: User[] = [];
  @Input() paginator!: Pagination;
  @Output() onPageSelected = new EventEmitter<number>();
  @Output() onOrderSelected = new EventEmitter<string>();
  showedUsers: User[] = [];
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  pageSelected = 1;

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

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    let actualParams = this.route.snapshot.queryParams;
    let tempSort = actualParams['sortBy'];
    let tempIndex = this.userSortOptions.findIndex(
      (sort) => sort.selectValue == tempSort
    );
    this.userSortOptionSelected =
      tempIndex >= 0
        ? this.userSortOptions[tempIndex].selectValue
        : 'relevance';
    this.pageSelected = this.paginator.current_page;
    this.showedUsers = [...this.users];
  }

  trackByUser(index: number, item: User): number {
    return item.id;
  }

  onCollectionSort() {
    this.onOrderSelected.emit(this.userSortOptionSelected);
  }

  onPageChange(e: string) {
    this.pageSelected = parseInt(e);
    this.onPageSelected.emit(this.pageSelected);
  }
}
