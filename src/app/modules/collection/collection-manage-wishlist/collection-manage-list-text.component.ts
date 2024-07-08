import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  EventEmitter,
  input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { Item } from 'src/app/core';
import { CollectionManageListControlsComponent } from './collection-manage-list-controls';

@Component({
  selector: 'app-collection-manage-list-text',
  templateUrl: './collection-manage-list-text.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    CollectionManageListControlsComponent,
  ],
})
export class CollectionManageListTextComponent {
  @Output() onSave = new EventEmitter<string>();
  @Output() onChangeMode = new EventEmitter<string>();

  listType = input.required<'wishlist' | 'tradelist'>();
  isSaving = input.required<boolean>();
  items = input.required<Item[]>();

  itemsSepator = ',';
  itemsQuantity = 0;
  itemsText = '';
  itemsRef = '';

  constructor(private cdr: ChangeDetectorRef) {
    effect(() => {
      const listAttribute = this.listType();
      this.itemsQuantity = 0;
      this.itemsText = '';
      this.itemsRef = '';

      this.items().forEach((item) => {
        // generamos la lista de referencia
        if (this.itemsRef) {
          this.itemsRef += this.itemsSepator;
        }
        this.itemsRef += item.name;

        // generamos la lista como texto del usuario
        if (item[listAttribute]) {
          if (this.itemsText) {
            this.itemsText += this.itemsSepator;
          }
          this.itemsText += item.name;
          if ((item[`${listAttribute}Quantity`] || 0) > 1) {
            this.itemsText += `(${item[`${listAttribute}Quantity`]})`;
          }
          this.itemsQuantity++;
        }
      });
      this.cdr.markForCheck();
    });
  }
}
