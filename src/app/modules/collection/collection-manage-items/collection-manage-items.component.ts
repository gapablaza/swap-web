import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';

import { Item } from 'src/app/core';
import { collectionFeature } from '../store/collection.state';
import { CollectionManageItemsListComponent } from './collection-manage-items-list.component';
import { collectionActions } from '../store/collection.actions';

@Component({
  selector: 'app-collection-manage-items',
  templateUrl: './collection-manage-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    AsyncPipe,
    CollectionManageItemsListComponent,
  ],
})
export class CollectionManageItemsComponent implements OnInit {
  items$ = this.store.select(collectionFeature.selectItems);
  isLoaded$ = this.store.select(collectionFeature.selectIsItemsLoaded);

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(collectionActions.loadItems());
  }

  onAddWish(item: Item) {
    // if already in wishlist, increment +1
    if (item.wishlist) {
      this.store.dispatch(
        collectionActions.itemIncrement({ item, listType: 'wishlist' })
      );
      // if not yet in wishlist, add it
    } else {
      this.store.dispatch(
        collectionActions.itemAdd({ item, listType: 'wishlist' })
      );
    }
  }

  onRemoveWish(item: Item) {
    // if item already in wishlist and quantity > 1, decrement -1
    if (item.wishlist && (item.wishlistQuantity || 0) > 1) {
      this.store.dispatch(
        collectionActions.itemDecrement({ item, listType: 'wishlist' })
      );
      // if already in wishlist, but once, remove from wishlist
    } else if (item.wishlist && item.wishlistQuantity == 1) {
      this.store.dispatch(
        collectionActions.itemRemove({ item, listType: 'wishlist' })
      );
    }
  }

  onAddTrade(item: Item) {
    // if already in tradelist, increment +1
    if (item.tradelist) {
      this.store.dispatch(
        collectionActions.itemIncrement({ item, listType: 'tradelist' })
      );
      // if not yet in tradelist, add it
    } else {
      this.store.dispatch(
        collectionActions.itemAdd({ item, listType: 'tradelist' })
      );
    }
  }

  onRemoveTrade(item: Item) {
    // if item already in tradelist and quantity > 1, decrement -1
    if (item.tradelist && (item.tradelistQuantity || 0) > 1) {
      this.store.dispatch(
        collectionActions.itemDecrement({ item, listType: 'tradelist' })
      );
      // if already in tradelist, but once, remove from tradelist
    } else if (item.tradelist && item.tradelistQuantity == 1) {
      this.store.dispatch(
        collectionActions.itemRemove({ item, listType: 'tradelist' })
      );
    }
  }
}
