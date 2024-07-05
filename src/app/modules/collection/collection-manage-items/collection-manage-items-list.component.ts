import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { DEFAULT_ITEM_IMG, Item } from 'src/app/core';

@Component({
  selector: 'app-collection-manage-items-list',
  templateUrl: './collection-manage-items-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    MatBadgeModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    LazyLoadImageModule,
  ],
})
export class CollectionManageItemsListComponent {
  @Input() items: Item[] = [];
  @Output() onAddWish = new EventEmitter<Item>();
  @Output() onRemoveWish = new EventEmitter<Item>();
  @Output() onAddTrade = new EventEmitter<Item>();
  @Output() onRemoveTrade = new EventEmitter<Item>();

  defaultItemImage = DEFAULT_ITEM_IMG;
  searchText = '';

  onRightClick(event: MouseEvent, actionType: string, item: Item) {
    event.preventDefault();
    if (actionType === 'wish') {
      this.onRemoveWish.emit(item);
    } else if (actionType === 'trade') {
      this.onRemoveTrade.emit(item);
    }
  }

  // TO DO: Filtrar el listado de items
  onFilter() {
    // check at least 2 chars for search
    if (this.searchText.length > 1) {
      this.items.forEach((item) => {
        if (
          item.name
            .toLocaleLowerCase()
            .indexOf(this.searchText.toLocaleLowerCase()) !== -1 ||
          (item.description || '')
            .toLocaleLowerCase()
            .indexOf(this.searchText.toLocaleLowerCase()) !== -1
        ) {
          item.isHidden = false;
        } else {
          item.isHidden = true;
        }
      });
      //   this.cdr.detectChanges();
    }
  }

  onClearFilter() {
    this.items.forEach((item) => {
      item.isHidden = false;
    });
    this.searchText = '';
    // this.cdr.detectChanges();
  }
}
