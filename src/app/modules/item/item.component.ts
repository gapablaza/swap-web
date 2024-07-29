import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';

import { SlugifyPipe } from '../../shared/pipes/slugify.pipe';
import { itemFeature } from './store/item.state';
import { ItemUsersListComponent } from './item-users-list.component';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  standalone: true,
  imports: [
    RouterLink,
    AsyncPipe,

    MatProgressSpinnerModule,
    MatTabsModule,

    SlugifyPipe,
    ItemUsersListComponent,
  ],
})
export class ItemComponent {
  isLoaded$ = this.store.select(itemFeature.selectIsLoaded);
  item$ = this.store.select(itemFeature.selectItem);
  collection$ = this.store.select(itemFeature.selectCollection);
  usersWishing$ = this.store.select(itemFeature.selectWishing);
  usersTrading$ = this.store.select(itemFeature.selectTrading);

  // TO DO: Manejar el caso cuando no se encuentre el ítem solicitado
  constructor(private store: Store) {}
}
