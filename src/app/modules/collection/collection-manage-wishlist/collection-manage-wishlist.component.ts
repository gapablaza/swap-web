import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, filter, tap } from 'rxjs';
import {
  Collection,
  CollectionService,
  CollectionUserData,
  Item,
} from 'src/app/core';
import { UIService } from 'src/app/shared';
import { CollectionOnlyService } from '../collection-only.service';

@Component({
  selector: 'app-collection-manage-wishlist',
  templateUrl: './collection-manage-wishlist.component.html',
  styleUrls: ['./collection-manage-wishlist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionManageWishlistComponent implements OnInit {
  collection: Collection = {} as Collection;
  items: Item[] = [];
  isSaving = false;
  isLoaded = false;

  constructor(
    private colSrv: CollectionService,
    private colOnlySrv: CollectionOnlyService,
    private router: Router,
    private route: ActivatedRoute,
    private uiSrv: UIService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.colOnlySrv.collection$
      .pipe(
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
        this.items = data;
        this.isLoaded = true;
        this.cdr.detectChanges();
      });
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
    this.colSrv.setWishlist(this.collection.id, wishingItems).subscribe({
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
      }
    });
  }
}
