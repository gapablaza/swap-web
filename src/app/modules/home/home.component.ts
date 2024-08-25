import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';

import { HomeStore } from './home.store';
import { ListCollectionsComponent } from './list-collections/list-collections.component';
import { ListUsersComponent } from './list-users/list-users.component';
import { ListResaltedCollectionsComponent } from './list-resalted-collections/list-resalted-collections.component';
import { HomeFeedsComponent } from './home-feeds/home-feeds.component';
import { HomePlaceholderComponent } from './home-placeholder.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [HomeStore],
  imports: [
    AsyncPipe,
    NgIf,

    HomeFeedsComponent,
    HomePlaceholderComponent,
    ListCollectionsComponent,
    ListResaltedCollectionsComponent,
    ListUsersComponent,
  ],
})
export class HomeComponent implements OnInit {
  vm$ = this.homeStore.vm$;
  isLoaded$ = this.homeStore.select((state) => state.isLoaded);

  constructor(private readonly homeStore: HomeStore) {}

  ngOnInit(): void {
    this.homeStore.fetchData();
  }
}
