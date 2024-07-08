import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';

import { collectionFeature } from '../store/collection.state';
import { collectionActions } from '../store/collection.actions';
import { CollectionManageListButtonsComponent } from '../collection-manage-wishlist/collection-manage-list-buttons.component';
import { CollectionManageListTextComponent } from '../collection-manage-wishlist/collection-manage-list-text.component';

@Component({
  selector: 'app-collection-manage-tradelist',
  templateUrl: './collection-manage-tradelist.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    AsyncPipe,
    CollectionManageListButtonsComponent,
    CollectionManageListTextComponent,
  ],
})
export class CollectionManageTradelistComponent implements OnInit {
  items$ = this.store.select(collectionFeature.selectItems);
  isLoaded$ = this.store.select(collectionFeature.selectIsItemsLoaded);
  isProcessing$ = this.store.select(collectionFeature.selectIsProcessing);

  typeSelected = 'botones';

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(collectionActions.loadItems());
  }

  onChangeMode(mode: string) {
    this.typeSelected = mode;
  }

  onSave(items: string) {
    this.store.dispatch(
      collectionActions.updateList({ listText: items, listType: 'tradelist' })
    );
  }
}
