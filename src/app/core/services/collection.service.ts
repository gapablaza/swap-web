import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from './api.service';
import { Collection, Item, Media, User } from '../models';
import {
  EXAMPLE_RAW_COLLECTION,
  EXAMPLE_RAW_COLLECTION_ITEMS,
  EXAMPLE_RAW_COLLECTION_MEDIA,
  EXAMPLE_RAW_COLLECTION_USERS
} from '../constants';

@Injectable()
export class CollectionService {

  constructor(
    private apiSrv: ApiService
  ) { }

  get(collectionId: number): Observable<Collection> {
    // return this.apiSrv.get('/collections/' + collectionId + '?include=publisher')
    return of(EXAMPLE_RAW_COLLECTION)
      .pipe(map((data: { data: Collection }) => data.data));
  }

  getItems(collectionId: number): Observable<Item[]> {
    // return this.apiSrv.get('/collections/' + collectionId + '/items')
    return of(EXAMPLE_RAW_COLLECTION_ITEMS)
      .pipe(map((data: { data: Item[] }) => data.data));
  }

  getMedia(collectionId: number): Observable<Media[]> {
    // return this.apiSrv.get('/collections/' + collectionId + '/medias?include=user')
    return of(EXAMPLE_RAW_COLLECTION_MEDIA)
      .pipe(map((data: { data: Media[], total: number }) => {
        return data.data
      }));
  }

  getUsers(collectionId: number): Observable<User[]> {
    // return this.apiSrv.get('/collections/' + collectionId + '/users')
    return of(EXAMPLE_RAW_COLLECTION_USERS)
      .pipe(map((data: { data: User[] }) => data.data));
  }

  getTops(collectionId: number): Observable<any> {
    return this.apiSrv.get('/collections/' + collectionId + '/tops')
      // .pipe(map((data: { available: boolean, categories: any[] }) =>
      //   ({ available: data.available, categories: data.categories})));
      .pipe(map((data) => data.data));
  }

  add(collectionId: number): Observable<string> {
    return this.apiSrv.post('/collections/' + collectionId)
      .pipe(map((data: { message: string }) => data.message));
  }

  setWishlist(collectionId: number, wishlist: string): Observable<any> {
    return this.apiSrv.post('/collections/' + collectionId + '/wishlist', {
      list: wishlist,
      separator: ','
    })
      .pipe(map((data) => data));
  }

  setTradelist(collectionId: number, tradelist: string): Observable<any> {
    return this.apiSrv.post('/collections/' + collectionId + '/tradelist', {
      list: tradelist,
      separator: ','
    })
      .pipe(map((data) => data));
  }

  setCompleted(collectionId: number, status: boolean): Observable<string> {
    if (status) {
      return this.apiSrv.post('/collections/' + collectionId + '/completed')
        .pipe(map((data: { message: string }) => data.message));
    } else {
      return this.apiSrv.delete('/collections/' + collectionId + '/completed')
        .pipe(map((data: { message: string }) => data.message));
    }
  }

  remove(collectionId: number): Observable<string> {
    return this.apiSrv.delete('/collections/' + collectionId + '?message=QUITAR')
      .pipe(map((data: { message: string }) => data.message));
  }
}
