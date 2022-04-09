import { Component, OnInit } from '@angular/core';
import { concatMap, of } from 'rxjs';

import { Collection, CollectionService, User } from 'src/app/core';
import { CollectionOnlyService } from '../collection-only.service';

@Component({
  selector: 'app-collection-users',
  templateUrl: './collection-users.component.html',
  styleUrls: ['./collection-users.component.scss'],
})
export class CollectionUsersComponent implements OnInit {
  collection: Collection = {} as Collection;
  users: User[] = [];
  showedUsers: User[] = [];
  searchText = '';
  isLoaded = false;

  constructor(
    private colSrv: CollectionService,
    private colOnlySrv: CollectionOnlyService
  ) {}

  ngOnInit(): void {
    this.colOnlySrv.collection$
      .pipe(
        concatMap((col) => {
          if (col.id) {
            this.collection = col;
            return this.colSrv.getUsers(col.id);
          } else {
            return of([]);
          }
        })
      )
      .subscribe((users) => {
        this.users = users.sort((a, b) => {
          return (a.summary?.daysSinceUpdate || 0) >
            (b.summary?.daysSinceUpdate || 0)
            ? 1
            : -1;
        });
        this.showedUsers = [...this.users];
        console.log(this.showedUsers);
        if (this.collection.id) {
          this.isLoaded = true;
        }
      });
  }

  trackByUsers(index: number, item: User): number {
    return item.id;
  }

  onFilter() {
    // check at least 2 chars for search
    if (this.searchText.length > 1) {
      this.showedUsers = this.users.filter((user: User) => {
        return (
          user.displayName
            .toLowerCase()
            .indexOf(this.searchText.toLowerCase()) !== -1 ||
          (user.location || '')
            .toLowerCase()
            .indexOf(this.searchText.toLowerCase() || '') !== -1 ||
          user.id
            .toString()
            .toLowerCase()
            .indexOf(this.searchText.toLowerCase()) !== -1
        );
      });
    }
  }
}
