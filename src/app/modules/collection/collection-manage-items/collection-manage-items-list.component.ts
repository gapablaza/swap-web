import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  computed,
  input,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';

import { DEFAULT_ITEM_IMG, Item } from 'src/app/core';

@Component({
  selector: 'app-collection-manage-items-list',
  templateUrl: './collection-manage-items-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,

    MatBadgeModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
})
export class CollectionManageItemsListComponent {
  items = input<Item[]>([]);
  managedItems = computed(() =>
    this.items().filter((i) => this.applyFilter(i, this.searchText()))
  );
  @Output() onAddWish = new EventEmitter<Item>();
  @Output() onRemoveWish = new EventEmitter<Item>();
  @Output() onAddTrade = new EventEmitter<Item>();
  @Output() onRemoveTrade = new EventEmitter<Item>();

  defaultItemImage = DEFAULT_ITEM_IMG;
  searchText = signal('');

  onRightClick(event: MouseEvent, actionType: string, item: Item) {
    event.preventDefault();
    if (actionType === 'wish') {
      this.onRemoveWish.emit(item);
    } else if (actionType === 'trade') {
      this.onRemoveTrade.emit(item);
    }
  }

  applyFilter(item: Item, searchText: string): boolean {
    if (searchText.length <= 1) {
      return true;
    }

    const lowerSearchText = searchText.toLocaleLowerCase();
    const itemNameMatches = item.name
      .toLocaleLowerCase()
      .includes(lowerSearchText);
    const itemDescriptionMatches = (item.description || '')
      .toLocaleLowerCase()
      .includes(lowerSearchText);

    return itemNameMatches || itemDescriptionMatches;
  }

  onClearFilter() {
    this.searchText.set('');
  }
}
