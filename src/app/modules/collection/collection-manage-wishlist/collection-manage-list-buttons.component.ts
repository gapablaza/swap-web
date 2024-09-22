import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  EventEmitter,
  input,
  Output,
} from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Item } from 'src/app/core';
import { CollectionManageListControlsComponent } from './collection-manage-list-controls';

@Component({
  selector: 'app-collection-manage-list-buttons',
  templateUrl: './collection-manage-list-buttons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,

    CollectionManageListControlsComponent,
  ],
})
export class CollectionManageListButtonsComponent {
  @Output() onSave = new EventEmitter<string>();
  @Output() onChangeMode = new EventEmitter<string>();

  listType = input.required<'wishlist' | 'tradelist'>();
  isSaving = input.required<boolean>();
  items = input.required<Item[]>();
  managedItems: Item[] = [];

  private longPressTimeout: any;
  private isLongPress = false;

  constructor(private cdr: ChangeDetectorRef) {
    effect(() => {
      this.managedItems = this.items().map((item) => ({ ...item }));
      this.cdr.markForCheck();
    });
  }

  onCheckList() {
    if (this.isSaving()) return;

    const listAttribute = this.listType();
    this.managedItems.forEach((item: Item) => {
      if (!item[listAttribute]) {
        item[listAttribute] = true;
        item[`${listAttribute}Quantity`] = 1;
      }
    });
  }

  onUncheckList() {
    if (this.isSaving()) return;

    const listAttribute = this.listType();
    this.managedItems.forEach((item: Item) => {
      if (item[listAttribute]) {
        item[listAttribute] = false;
        item[`${listAttribute}Quantity`] = 0;
      }
    });
  }

  onAdd(item: Item) {
    if (this.isLongPress) {
      this.isLongPress = false;
      return;
    }

    if (this.isSaving()) return;

    const listAttribute = this.listType();
    // if already in list, increment +1
    if (item[listAttribute]) {
      if ((item[`${listAttribute}Quantity`] || 0) < 99) {
        item[`${listAttribute}Quantity`] =
          (item[`${listAttribute}Quantity`] || 0) + 1;
      }
      // if not yet in list, add it
    } else {
      item[listAttribute] = true;
      item[`${listAttribute}Quantity`] = 1;
    }
  }

  onRemove(item: Item) {
    if (this.isSaving()) return;

    const listAttribute = this.listType();
    // if item already in list and quantity > 1, decrement -1
    if (item[listAttribute] && (item[`${listAttribute}Quantity`] || 0) > 1) {
      item[`${listAttribute}Quantity`] =
        (item[`${listAttribute}Quantity`] || 0) - 1;
      // if already in list, but once, remove from list
    } else if (item[listAttribute] && item[`${listAttribute}Quantity`] == 1) {
      item[`${listAttribute}Quantity`] = 0;
      item[listAttribute] = false;
    }
  }

  onHandleRemove(event: MouseEvent | TouchEvent, item: Item) {
    if (event instanceof MouseEvent && event.button === 2) {
      event.preventDefault();
      this.onRemove(item);
    }
  }

  onPressStart(event: MouseEvent | TouchEvent, item: Item) {
    // Ignoramos si no es el botón izquierdo del mouse
    if (event instanceof MouseEvent && event.button !== 0) {
      return;
    }

    event.preventDefault();
    this.isLongPress = false;

    this.longPressTimeout = setTimeout(() => {
      this.isLongPress = true;
      this.onRemove(item);
    }, 500); // Ajusta el tiempo de la pulsación larga según sea necesario
  }

  onPressEnd(event: MouseEvent | TouchEvent, item: Item) {
    event.preventDefault();
    clearTimeout(this.longPressTimeout);

    if (!this.isLongPress) {
      // Ignoramos si no es el botón izquierdo del mouse
      if (event instanceof MouseEvent && event.button !== 0) {
        return;
      }

      this.onAdd(item);
    }
  }

  itemsToText(items: Item[]): string {
    const listAttribute = this.listType();
    let itemsInText = '';
    items.forEach((item: Item) => {
      if (item[listAttribute]) {
        if (itemsInText) {
          itemsInText += ',';
        }
        itemsInText += item.name;
        if ((item[`${listAttribute}Quantity`] || 0) > 1) {
          itemsInText += '(' + item[`${listAttribute}Quantity`] + ')';
        }
      }
    });
    return itemsInText;
  }

  getItemQuantity(item: Item, listType: 'wishlist' | 'tradelist'): number {
    return item[`${listType}Quantity`] || 0;
  }
}
