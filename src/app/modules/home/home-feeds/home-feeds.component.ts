import {
  DatePipe,
  NgClass,
  NgFor,
  NgIf,
  NgSwitch,
  NgSwitchCase,
} from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  Database,
  orderByChild,
  query,
  ref,
  stateChanges,
} from '@angular/fire/database';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { SlugifyPipe } from 'src/app/shared';

@Component({
  selector: 'app-home-feeds',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    NgSwitch,
    NgSwitchCase,

    MatIconModule,
    RouterLink,
    DatePipe,
    SlugifyPipe,
  ],
  templateUrl: './home-feeds.component.html',
  styleUrl: './home-feeds.component.scss',
})
export class HomeFeedsComponent implements OnInit, OnDestroy {
  feeds: any[] = [];
  MAX_FEEDS_RECORDS = 50;

  isLoaded = false;
  subs: Subscription = new Subscription();

  constructor(private firebaseDB: Database, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    let feedsSub = stateChanges(
      query(ref(this.firebaseDB, `feedsHome`), orderByChild('timestamp'))
    ).subscribe((obj) => {
      if (obj.event != 'child_added') return;

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
