import { Component, OnInit } from '@angular/core';

import { Collection, CollectionService, User } from 'src/app/core';
import { CollectionOnlyService } from '../collection-only.service';

@Component({
  selector: 'app-collection-users',
  templateUrl: './collection-users.component.html',
  styleUrls: ['./collection-users.component.scss']
})
export class CollectionUsersComponent implements OnInit {
  collection!: Collection;
  users: User[] = [];
  showedUsers: User[] = [];
  searchText = '';

  constructor(
    private colSrv: CollectionService,
    private colOnlySrv: CollectionOnlyService,
  ) { }

  ngOnInit(): void {
    this.collection = this.colOnlySrv.getCurrentCollection();
    this.colSrv.getUsers(this.collection.id)
      .subscribe(data => {
        this.users = data
          .sort((a, b) => {
            return ((a.summary?.daysSinceUpdate || 0) > (b.summary?.daysSinceUpdate || 0) ? 1 : -1)
          });
        this.showedUsers = this.users;
      });
  }

  trackByUsers(index: number, item: User): number {
    return item.id;
  }

  onFilter() {
    // check at least 2 chars for search
    if (this.searchText.length > 1) {
      this.showedUsers = this.users.filter((user: User) => {
        return (user.displayName.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1)
          || ((user.location || '').toLowerCase().indexOf(this.searchText.toLowerCase() || '') !== -1)
          || (user.id.toString().toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1)
      })
    }
  }
}
