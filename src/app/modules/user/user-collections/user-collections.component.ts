import { Component, OnInit } from '@angular/core';
import { concatMap, map, of } from 'rxjs';

import { Collection, User, UserService } from 'src/app/core';
import { UserOnlyService } from '../user-only.service';

@Component({
  selector: 'app-user-collections',
  templateUrl: './user-collections.component.html',
  styleUrls: ['./user-collections.component.scss']
})
export class UserCollectionsComponent implements OnInit {
  user: User = {} as User;
  collections: Collection[] = [];
  isLoaded = false;

  constructor(
    private userSrv: UserService,
    private userOnlySrv: UserOnlyService,
  ) { }

  ngOnInit(): void {
    this.userOnlySrv.user$
      .pipe(
        concatMap(user => {
          if (user.id) {
            this.user = user;
            return this.userSrv.getCollections(user.id)
              .pipe(map((data: { collections: Collection[], trades: any }) => {
                return data.collections;
              }));
          } else {
            return of([]);
          }
        })
      )
      .subscribe(collections => {
        this.collections = collections;
        if (this.user.id) {
          this.isLoaded = true;
        }
      });
    console.log('from UserCollectionsComponent');
  }

  trackByCollection(index: number, item: Collection): number {
    return item.id;
  }
}
