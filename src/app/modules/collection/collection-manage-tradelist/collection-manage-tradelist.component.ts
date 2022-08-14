import { Component, OnInit } from '@angular/core';
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
  selector: 'app-collection-manage-tradelist',
  templateUrl: './collection-manage-tradelist.component.html',
  styleUrls: ['./collection-manage-tradelist.component.scss'],
})
export class CollectionManageTradelistComponent implements OnInit {
  collection: Collection = {} as Collection;
  items: Item[] = [];
  isSaving = false;
  isLoaded = false;

  constructor(
    private colSrv: CollectionService,
    private colOnlySrv: CollectionOnlyService,
    private router: Router,
    private route: ActivatedRoute,
    private uiSrv: UIService
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
      });
  }

  trackById(index: number, item: Item): number {
    return item.id;
  }

  onAddTrade(item: Item) {
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
    this.items.forEach((item: Item) => {
      if (!item.tradelist) {
        item.tradelist = true;
        item.tradelistQuantity = 1;
      }
    });
  }

  onUncheckAllTradelist() {
    this.items.forEach((item: Item) => {
      if (item.tradelist) {
        item.tradelist = false;
        item.tradelistQuantity = 0;
      }
    });
  }

  onSaveTradelist() {
    this.isSaving = true;
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
    this.colSrv.setTradelist(this.collection.id, tradingItems).subscribe({
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
      complete: () => (this.isSaving = false),
    });
  }
}
