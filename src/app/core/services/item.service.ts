import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Collection, Item, User } from '../models';

import { ApiService } from './api.service';

@Injectable()
export class ItemService {
  constructor(private apiSrv: ApiService) {}

  get(
    itemId: number
  ): Observable<{
    item: Item;
    collection: Collection;
    wishing: User[];
    trading: User[];
  }> {
    return this.apiSrv
      .get('/v2/items/' + itemId + '?include=collection.publisher')
      .pipe(
        map((data: { data: any }) => {
          console.log(data.data);
          
          return {
            item: data.data as Item,
            collection: data.data.collection.data as Collection,
            wishing: data.data.searching as User[],
            trading: data.data.trading as User[],
          };
        })
      );
  }

  addToWishlist(itemId: number): Observable<string> {
    return this.apiSrv
      .post('/v2/items/' + itemId + '/wishlist')
      .pipe(map((data: { message: string }) => data.message));
  }

  incrementWishlist(
    itemId: number
  ): Observable<{ message: string; newQuantity: number }> {
    return this.apiSrv
      .post('/v2/items/' + itemId + '/wishlist/increment')
      .pipe(map((data: { message: string; newQuantity: number }) => data));
  }

  decrementWishlist(
    itemId: number
  ): Observable<{ message: string; newQuantity: number }> {
    return this.apiSrv
      .post('/v2/items/' + itemId + '/wishlist/decrement')
      .pipe(map((data: { message: string; newQuantity: number }) => data));
  }

  removeFromWishlist(itemId: number): Observable<string> {
    return this.apiSrv
      .delete('/v2/items/' + itemId + '/wishlist')
      .pipe(map((data: { message: string }) => data.message));
  }

  addToTradelist(itemId: number): Observable<string> {
    return this.apiSrv
      .post('/v2/items/' + itemId + '/tradelist')
      .pipe(map((data: { message: string }) => data.message));
  }

  incrementTradelist(
    itemId: number
  ): Observable<{ message: string; newQuantity: number }> {
    return this.apiSrv
      .post('/v2/items/' + itemId + '/tradelist/increment')
      .pipe(map((data: { message: string; newQuantity: number }) => data));
  }

  decrementTradelist(
    itemId: number
  ): Observable<{ message: string; newQuantity: number }> {
    return this.apiSrv
      .post('/v2/items/' + itemId + '/tradelist/decrement')
      .pipe(map((data: { message: string; newQuantity: number }) => data));
  }

  removeFromTradelist(itemId: number): Observable<string> {
    return this.apiSrv
      .delete('/v2/items/' + itemId + '/tradelist')
      .pipe(map((data: { message: string }) => data.message));
  }
}
