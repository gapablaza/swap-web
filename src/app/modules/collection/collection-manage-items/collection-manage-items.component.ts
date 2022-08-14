import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, filter, take, tap } from 'rxjs';
import {
  Collection,
  CollectionService,
  CollectionUserData,
  DEFAULT_ITEM_IMG,
  Item,
  ItemService,
} from 'src/app/core';
import { UIService } from 'src/app/shared';
import { CollectionOnlyService } from '../collection-only.service';

export interface CustomItem extends Item {
  isSaving?: boolean,
  isHidden?: boolean,
}

@Component({
  selector: 'app-collection-manage-items',
  templateUrl: './collection-manage-items.component.html',
  styleUrls: ['./collection-manage-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionManageItemsComponent implements OnInit, AfterViewInit {
  collection: Collection = {} as Collection;
  items: CustomItem[] = [];
  defaultItemImage = DEFAULT_ITEM_IMG;
  searchText = '';
  isSaving = false;
  isLoaded = false;

  constructor(
    private colSrv: CollectionService,
    private colOnlySrv: CollectionOnlyService,
    private itemSrv: ItemService,
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
        }),
        take(1),
      )
      .subscribe((data) => {
        this.items = data.map((item: CustomItem) => {
          return {
            ...item,
            isSaving: false,
            isHidden: false,
          }
        });
        this.isLoaded = true;
        this.cdr.detectChanges();
      });
  }

  ngAfterViewInit() {
    // Since we know the list is not going to change
    // let's request that this component not undergo change detection at all
    this.cdr.detach();
  }

  trackById(index: number, item: Item): number {
    return item.id;
  }

  onFilter() {
    // check at least 2 chars for search
    if (this.searchText.length > 1) {
      this.items.forEach(item => {
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
      })
      this.cdr.detectChanges();
    }
  }

  onClearFilter() {
    this.items.forEach(item => {
      item.isHidden = false;
    });
    this.searchText = '';
    this.cdr.detectChanges();
  }

  onAddWish(item: CustomItem) {
    console.log(item);
    
    item.isSaving = true;
    this.cdr.detectChanges();

    // if already in wishlist, increment +1
    if (item.wishlist) {
      this.itemSrv.incrementWishlist(item.id)
        .subscribe({
          next: (resp) => {
            item.wishlistQuantity = resp.newQuantity;
            this.uiSrv.showSuccess(resp.message);
          },
          error: (error) => {
            console.log('incrementWishlist error: ', error);
            this.uiSrv.showError(error.error.message);
          },
          complete: () => {
            item.isSaving = false;
            this.cdr.detectChanges();
          },
        })
      // if not yet in wishlist, add it
    } else {
      this.itemSrv.addToWishlist(item.id)
      .subscribe({
        next: (resp) => {
          item.wishlist = true;
          item.wishlistQuantity = 1;

          this.collection = {
            ...this.collection,
            userData: {
              ...this.collection.userData,
              wishing: (this.collection.userData?.wishing || 0) + 1,
            } as CollectionUserData,
          };
          this.colOnlySrv.setCurrentCollection(this.collection);

          this.uiSrv.showSuccess(resp);
        },
        error: (error) => {
          console.log('addToWishlist error: ', error);
          this.uiSrv.showError(error.error.message);
        },
        complete: () => {
          item.isSaving = false;
          this.cdr.detectChanges();
        },
      })
    }
  }

  onRemoveWish(item: CustomItem) {
    console.log(item);

    // if item already in wishlist and quantity > 1, decrement -1
    if (item.wishlist && (item.wishlistQuantity || 0) > 1) {
      item.isSaving = true;
      this.cdr.detectChanges();

      this.itemSrv.decrementWishlist(item.id)
        .subscribe({
          next: (resp) => {
            item.wishlistQuantity = resp.newQuantity;
            this.uiSrv.showSuccess(resp.message);
          },
          error: (error) => {
            console.log('decrementWishlist error: ', error);
            this.uiSrv.showError(error.error.message);
          },
          complete: () => {
            item.isSaving = false;
            this.cdr.detectChanges();
          },
        })
      // if already in wishlist, but once, remove from wishlist
    } else if (item.wishlist && item.wishlistQuantity == 1) {
      item.isSaving = true;
      this.cdr.detectChanges();

      this.itemSrv.removeFromWishlist(item.id)
      .subscribe({
        next: (resp) => {
          item.wishlist = false;
          item.wishlistQuantity = 0;

          this.collection = {
            ...this.collection,
            userData: {
              ...this.collection.userData,
              wishing: (this.collection.userData?.wishing || 0) - 1,
            } as CollectionUserData,
          };
          this.colOnlySrv.setCurrentCollection(this.collection);

          this.uiSrv.showSuccess(resp);
        },
        error: (error) => {
          console.log('removeFromWishlist error: ', error);
          this.uiSrv.showError(error.error.message);
        },
        complete: () => {
          item.isSaving = false;
          this.cdr.detectChanges();
        },
      })
    }

    return false;
  }

  onAddTrade(item: CustomItem) {
    console.log(item);
    
    item.isSaving = true;
    this.cdr.detectChanges();

    // if already in tradelist, increment +1
    if (item.tradelist) {
      this.itemSrv.incrementTradelist(item.id)
        .subscribe({
          next: (resp) => {
            item.tradelistQuantity = resp.newQuantity;
            this.uiSrv.showSuccess(resp.message);
          },
          error: (error) => {
            console.log('incrementTradelist error: ', error);
            this.uiSrv.showError(error.error.message);
          },
          complete: () => {
            item.isSaving = false;
            this.cdr.detectChanges();
          },
        })
      // if not yet in tradelist, add it
    } else {
      this.itemSrv.addToTradelist(item.id)
      .subscribe({
        next: (resp) => {
          item.tradelist = true;
          item.tradelistQuantity = 1;

          this.colOnlySrv.setCurrentCollection({
            ...this.collection,
            userData: {
              ...this.collection.userData,
              trading: (this.collection.userData?.trading || 0) + 1,
            } as CollectionUserData,
          });

          this.uiSrv.showSuccess(resp);
        },
        error: (error) => {
          console.log('addToTradelist error: ', error);
          this.uiSrv.showError(error.error.message);
        },
        complete: () => {
          item.isSaving = false;
          this.cdr.detectChanges();
        },
      })
    }
  }

  onRemoveTrade(item: CustomItem) {
    console.log(item);

    // if item already in tradelist and quantity > 1, decrement -1
    if (item.tradelist && (item.tradelistQuantity || 0) > 1) {
      item.isSaving = true;
      this.cdr.detectChanges();

      this.itemSrv.decrementTradelist(item.id)
        .subscribe({
          next: (resp) => {
            item.tradelistQuantity = resp.newQuantity;
            this.uiSrv.showSuccess(resp.message);
          },
          error: (error) => {
            console.log('decrementTradelist error: ', error);
            this.uiSrv.showError(error.error.message);
          },
          complete: () => {
            item.isSaving = false;
            this.cdr.detectChanges();
          },
        })
      // if already in tradelist, but once, remove from tradelist
    } else if (item.tradelist && item.tradelistQuantity == 1) {
      item.isSaving = true;
      this.cdr.detectChanges();

      this.itemSrv.removeFromTradelist(item.id)
      .subscribe({
        next: (resp) => {
          item.tradelist = false;
          item.tradelistQuantity = 0;

          this.colOnlySrv.setCurrentCollection({
            ...this.collection,
            userData: {
              ...this.collection.userData,
              trading: (this.collection.userData?.trading || 0) - 1,
            } as CollectionUserData,
          });

          this.uiSrv.showSuccess(resp);
        },
        error: (error) => {
          console.log('removeFromTradelist error: ', error);
          this.uiSrv.showError(error.error.message);
        },
        complete: () => {
          item.isSaving = false;
          this.cdr.detectChanges();
        },
      })
    }

    return false;
  }
}
