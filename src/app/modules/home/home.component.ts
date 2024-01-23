import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription, take } from 'rxjs';

import { Collection, SearchService, User } from 'src/app/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ListCollectionsComponent } from './list-collections/list-collections.component';
import { ListUsersComponent } from './list-users/list-users.component';
import { ListResaltedCollectionsComponent } from './list-resalted-collections/list-resalted-collections.component';
import {
  DatePipe,
  NgClass,
  NgFor,
  NgIf,
  NgSwitch,
  NgSwitchCase,
} from '@angular/common';
import {
  Database,
  orderByChild,
  query,
  ref,
  stateChanges,
} from '@angular/fire/database';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { SlugifyPipe } from 'src/app/shared';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    NgSwitch,
    NgSwitchCase,
    ListResaltedCollectionsComponent,
    ListUsersComponent,
    ListCollectionsComponent,
    MatProgressSpinnerModule,
    MatIconModule,
    RouterLink,

    DatePipe,
    SlugifyPipe,
  ],
})
export class HomeComponent implements OnInit, OnDestroy {
  added: Collection[] = [];
  moreItems: User[] = [];
  moreMedia: User[] = [];
  morePositives: User[] = [];
  popular: Collection[] = [];
  published: Collection[] = [];
  users: User[] = [];
  feeds: any[] = [];
  MAX_FEEDS_RECORDS = 50;

  isLoaded = false;
  subs: Subscription = new Subscription();

  constructor(
    private searchSrv: SearchService,
    private firebaseDB: Database,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    let homeSub = this.searchSrv
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
          return (a.userSummary?.positives || 0) <
            (b.userSummary?.positives || 0)
            ? 1
            : -1;
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
    this.subs.add(homeSub);

    let feedsSub = stateChanges(
      query(ref(this.firebaseDB, `feedsHome`), orderByChild('timestamp'))
    ).subscribe((obj) => {
      if (obj.event != 'child_added') return;

      // console.log(obj.snapshot.val());
      let tempFeed = obj.snapshot.val();

      // Se crea una clave personalizada para agrupar registros
      // y que no parezcan repetidos en el feed
      if (
        tempFeed.type == 'UPDATE_COLLECTION' ||
        tempFeed.type == 'COMPLETE_COLLECTION' ||
        tempFeed.type == 'ADD_COLLECTION'
      ) {
        tempFeed.customKey =
          tempFeed.type + '|' + tempFeed.userId + '|' + tempFeed.collectionId;
      } else {
        tempFeed.customKey = obj.prevKey || 'temp';
      }

      // Se agregan solo los que no están "repetidos"
      if (!this.feeds.some((el) => el.customKey == tempFeed.customKey)) {
        this.feeds.unshift(tempFeed);
        if (this.feeds.length > this.MAX_FEEDS_RECORDS) {
          this.feeds.pop();
        }

        this.cdr.markForCheck();
      }
    });
    this.subs.add(feedsSub);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
