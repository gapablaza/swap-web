import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
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

@Component({
  selector: 'app-collection-manage-tradelist',
  templateUrl: './collection-manage-tradelist.component.html',
  styleUrls: ['./collection-manage-tradelist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionManageTradelistComponent implements OnInit, OnDestroy {
  collection: Collection = {} as Collection;
  items: Item[] = [];

  typeSelected = 'botones';
  itemsText = '';
  itemsRef = '';
  tradingQ = 0;
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
  ) {}

  ngOnInit(): void {
    let colSub = this.colOnlySrv.collection$
      .pipe(
        tap(() => {
          this.itemsText = '';
          this.tradingQ = 0;
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
        this.items = data;

        data.forEach((item) => {
          // generamos la lista de referencia
          if (this.itemsRef) {
            this.itemsRef += this.itemsSepator;
          }
          this.itemsRef += item.name;

          // generamos la lista de cambiando por el usuario
          if (item.tradelist) {
            if (this.itemsText) {
              this.itemsText += this.itemsSepator;
            }
            this.itemsText += item.name;
            if ((item.tradelistQuantity || 0) > 1) {
              this.itemsText += `(${item.tradelistQuantity})`;
            }
            this.tradingQ++;
          }
        });

        this.isLoaded = true;
        this.cdr.detectChanges();
      });
  }

  onChangeMode() {
    // console.log(this.typeSelected);
  }

  trackById(index: number, item: Item): number {
    return item.id;
  }

  onAddTrade(item: Item) {
    if (this.isSaving) return;

    // if already in tradelist, increment +1
    if (item.tradelist) {
      if ((item.tradelistQuantity || 0) < 99) {
        item.tradelistQuantity = (item.tradelistQuantity || 0) + 1;
      }
      // if not yet in tradelist, add it
    } else {
      item.tradelist = true;
      item.tradelistQuantity = 1;
    }
  }

  onRemoveTrade(item: Item) {
    if (this.isSaving) return;

    // if item already in tradelist and quantity > 1, decrement -1
    if (item.tradelist && (item.tradelistQuantity || 0) > 1) {
      item.tradelistQuantity = (item.tradelistQuantity || 0) - 1;
      // if already in tradelist, but once, remove from tradelist
    } else if (item.tradelist && item.tradelistQuantity == 1) {
      item.tradelistQuantity = 0;
      item.tradelist = false;
    }
    return false;
  }

  onCheckAllTradelist() {
    if (this.isSaving) return;

    this.items.forEach((item: Item) => {
      if (!item.tradelist) {
        item.tradelist = true;
        item.tradelistQuantity = 1;
      }
    });
  }

  onUncheckAllTradelist() {
    if (this.isSaving) return;

    this.items.forEach((item: Item) => {
      if (item.tradelist) {
        item.tradelist = false;
        item.tradelistQuantity = 0;
      }
    });
  }

  onSave() {
    if (this.typeSelected == 'botones') {
      this.onSaveTradelist();
    }

    if (this.typeSelected == 'texto') {
      this.onSaveTradelistByText();
    }
  }

  onSaveTradelist() {
    this.isSaving = true;
    this.cdr.detectChanges();

    let tradingItems = '';
    let totalTrading = 0;

    this.items.forEach((item: Item) => {
      if (item.tradelist) {
        totalTrading++;
        if (tradingItems) {
          tradingItems += ',';
        }
        tradingItems += item.name;
        if ((item.tradelistQuantity || 0) > 1) {
          tradingItems += '(' + item.tradelistQuantity + ')';
        }
      }
    });
    this.colSrv
      .setTradelist(this.collection.id, tradingItems)
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
              trading: totalTrading,
            } as CollectionUserData,
          });

          this.uiSrv.showSuccess(message);
        },
        error: (error) => {
          console.log('setTradelist error: ', error);
          this.uiSrv.showError(error.error.message);
        },
        complete: () => {
          this.isSaving = false;
          this.cdr.detectChanges();
        },
      });
  }

  onSaveTradelistByText() {
    this.isSaving = true;
    this.cdr.detectChanges();

    this.colSrv
      .setTradelist(this.collection.id, this.itemsText)
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
        next: (col) => this.colOnlySrv.setCurrentCollection(col),
        error: (error) => {
          console.log('setTradelist error: ', error);
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
