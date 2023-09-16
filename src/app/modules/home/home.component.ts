import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { take } from 'rxjs';

import { Collection, SearchService, User } from 'src/app/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ListCollectionsComponent } from './list-collections/list-collections.component';
import { ListUsersComponent } from './list-users/list-users.component';
import { ListResaltedCollectionsComponent } from './list-resalted-collections/list-resalted-collections.component';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
        ListResaltedCollectionsComponent,
        ListUsersComponent,
        ListCollectionsComponent,
        MatProgressSpinnerModule,
    ],
})
export class HomeComponent implements OnInit {
  added: Collection[] = [];
  moreItems: User[] = [];
  moreMedia: User[] = [];
  morePositives: User[] = [];
  popular: Collection[] = [];
  published: Collection[] = [];
  users: User[] = [];
  isLoaded = false;

  constructor(
    private searchSrv: SearchService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.searchSrv
      .getHomeData()
      .pipe(take(1))
      .subscribe((data) => {
        this.added = data.added.sort((a, b) => {
          return a.id < b.id ? 1 : -1;
        });

        this.moreItems = data.moreItems.sort((a, b) => {
          return (a.totalItems || 0) < (b.totalItems || 0) ? 1 : -1;
        });

        this.moreMedia = data.moreMedia.sort((a, b) => {
          return (a.contributions || 0) < (b.contributions || 0) ? 1 : -1;
        });

        this.morePositives = data.morePositives.sort((a, b) => {
          return (a.userSummary?.positives || 0) < (b.userSummary?.positives || 0) ? 1 : -1;
        });

        this.popular = data.popular.sort((a, b) => {
          return (a.recentCollecting || 0) < (b.recentCollecting || 0) ? 1 : -1;
        });

        this.published = data.published.sort((a, b) => {
          return a.release < b.release ? 1 : -1;
        });

        this.users = data.users.sort((a, b) => {
          return a.id < b.id ? 1 : -1;
        });

        this.isLoaded = true;
        this.cdr.markForCheck();
      });
  }
}
