import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, filter, Subscription, take, tap } from 'rxjs';
import {
  Collection,
  CollectionService,
  CollectionUserData,
  Item,
} from 'src/app/core';
import { UIService } from 'src/app/shared';
import { CollectionOnlyService } from '../collection-only.service';
import { MatBadgeModule } from '@angular/material/badge';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-collection-manage-wishlist',
  templateUrl: './collection-manage-wishlist.component.html',
  styleUrls: ['./collection-manage-wishlist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    NgFor,
    MatBadgeModule,
  ],
})
export class CollectionManageWishlistComponent implements OnInit, OnDestroy {
  collection: Collection = {} as Collection;
  items: Item[] = [];
  typeSelected = 'botones';
  itemsText = '';
  itemsRef = '';
  wishingQ = 0;
  itemsSepator = ',';
  isSaving = false;
  isLoaded = false;
  subs: Subscription = new Subscription();

  constructor(
    private colSrv: CollectionService,
    private colOnlySrv: CollectionOnlyService,
    private router: Router,
    private route: ActivatedRoute,
    private uiSrv: UIService,
    private cdr: ChangeDetectorRef
  ) {
    // inject(HAMMER_GESTURE_CONFIG);
  }

  ngOnInit(): void {
    let colSub = this.colOnlySrv.collection$
      .pipe(
        tap(() => {
          this.itemsText = '';
          this.wishingQ = 0;
          this.isLoaded = false;
        }),
        filter((col) => col.id != null),
        tap((col) => {
          if (!col.userData?.collecting) {
            this.uiSrv.showError('Aún no tienes agregada esta colección');
            this.router.navigate(['../'], {
              relativeTo: this.route,
            });
          }
        }),
        filter((col) => (col.userData?.collecting ? true : false)),
        concatMap((col) => {
          this.collection = col;
          return this.colSrv.getItems(this.collection.id);
        })
      )
      .subscribe((data) => {
        this.items = data.sort((a, b) => (a.position || 0) - (b.position || 0));

        data.forEach((item) => {
          // generamos la lista de referencia
          if (this.itemsRef) {
            this.itemsRef += this.itemsSepator;
          }
          this.itemsRef += item.name;

          // generamos la lista de buscadas por el usuario
          if (item.wishlist) {
            if (this.itemsText) {
              this.itemsText += this.itemsSepator;
            }
            this.itemsText += item.name;
            if ((item.wishlistQuantity || 0) > 1) {
              this.itemsText += `(${item.wishlistQuantity})`;
            }
            this.wishingQ++;
          }
        });

        this.isLoaded = true;
        this.cdr.detectChanges();
      });
    this.subs.add(colSub);
  }

  onChangeMode() {
    // console.log(this.typeSelected);
  }

  trackById(index: number, item: Item): number {
    return item.id;
  }

  onAddWish(item: Item) {
    if (this.isSaving) return;

    // if already in wishlist, increment +1
    if (item.wishlist) {
      if ((item.wishlistQuantity || 0) < 99) {
        item.wishlistQuantity = (item.wishlistQuantity || 0) + 1;
      }
      // if not yet in wishlist, add it
    } else {
      item.wishlist = true;
      item.wishlistQuantity = 1;
    }
  }

  onRemoveWish(item: Item) {
    // console.log(item);
    if (this.isSaving) return;

    // if item already in wishlist and quantity > 1, decrement -1
    if (item.wishlist && (item.wishlistQuantity || 0) > 1) {
      item.wishlistQuantity = (item.wishlistQuantity || 0) - 1;
      // if already in wishlist, but once, remove from wishlist
    } else if (item.wishlist && item.wishlistQuantity == 1) {
      item.wishlistQuantity = 0;
      item.wishlist = false;
    }
    return false;
  }

  onCheckAllWishlist() {
    if (this.isSaving) return;

    this.items.forEach((item: Item) => {
      if (!item.wishlist) {
        item.wishlist = true;
        item.wishlistQuantity = 1;
      }
    });
  }

  onUncheckAllWishlist() {
    if (this.isSaving) return;

    this.items.forEach((item: Item) => {
      if (item.wishlist) {
        item.wishlist = false;
        item.wishlistQuantity = 0;
      }
    });
  }

  onSave() {
    if (this.typeSelected == 'botones') {
      this.onSaveWishlist();
    }

    if (this.typeSelected == 'texto') {
      this.onSaveWishlistByText();
    }
  }

  onSaveWishlist() {
    this.isSaving = true;
    this.cdr.detectChanges();

    let wishingItems = '';
    let totalWishing = 0;

    this.items.forEach((item: Item) => {
      if (item.wishlist) {
        totalWishing++;
        if (wishingItems) {
          wishingItems += ',';
        }
        wishingItems += item.name;
        if ((item.wishlistQuantity || 0) > 1) {
          wishingItems += '(' + item.wishlistQuantity + ')';
        }
      }
    });
    this.colSrv
      .setWishlist(this.collection.id, wishingItems)
      .pipe(take(1))
      .subscribe({
        next: (resp) => {
          let message = resp.message;
          if (resp.bothListsTotal > 1) {
            message +=
              ', pero atención! porque tienes ' +
              resp.bothListsTotal +
              ' ítems marcados como faltantes y repetidos';
          } else if (resp.bothListsTotal == 1) {
            message +=
              ', pero atención! porque tienes ' +
              resp.bothListsTotal +
              ' ítem marcado como faltante y repetido';
          }

          this.colOnlySrv.setCurrentCollection({
            ...this.collection,
            userData: {
              ...this.collection.userData,
              wishing: totalWishing,
            } as CollectionUserData,
          });

          this.uiSrv.showSuccess(message);
        },
        error: (error) => {
          console.log('setWishlist error: ', error);
          this.uiSrv.showError(error.error.message);
        },
        complete: () => {
          this.isSaving = false;
          this.cdr.detectChanges();
        },
      });
  }

  onSaveWishlistByText() {
    this.isSaving = true;
    this.cdr.detectChanges();

    this.colSrv
      .setWishlist(this.collection.id, this.itemsText)
      .pipe(
        tap((resp) => {
          let message = resp.message;
          if (resp.bothListsTotal > 1) {
            message +=
              ', pero atención! porque tienes ' +
              resp.bothListsTotal +
              ' ítems marcados como faltantes y repetidos';
          } else if (resp.bothListsTotal == 1) {
            message +=
              ', pero atención! porque tienes ' +
              resp.bothListsTotal +
              ' ítem marcado como faltante y repetido';
          }

          this.uiSrv.showSuccess(message);
        }),
        concatMap(() => this.colSrv.get(this.collection.id).pipe(take(1)))
      )
      .subscribe({
        next: (col) => this.colOnlySrv.setCurrentCollection(col.collection),
        error: (error) => {
          console.log('setWishlist error: ', error);
          this.uiSrv.showError(error.error.message);
        },
        complete: () => {
          this.isSaving = false;
          this.cdr.detectChanges();
        },
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
