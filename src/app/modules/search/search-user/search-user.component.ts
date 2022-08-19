import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { DEFAULT_USER_PROFILE_IMG, Pagination, User } from 'src/app/core';

@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  styleUrls: ['./search-user.component.scss']
})
export class SearchUserComponent implements OnInit {
  @Input() users: User[] = [];
  @Input() paginator!: Pagination;
  @Output() onPageSelected = new EventEmitter<number>();
  showedUsers: User[] = [];
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  pageSelected = 1;

  constructor() { }

  ngOnInit(): void {
    console.log('SearchUserComponent ngOnInit');
    this.pageSelected = this.paginator.current_page;
    this.showedUsers = [...this.users];
  }

  trackByUser(index: number, item: User): number {
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
