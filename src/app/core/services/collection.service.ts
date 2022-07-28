import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from './api.service';
import { Collection, Item, Media, Tops, TopsCategory, User } from '../models';

@Injectable()
export class CollectionService {

  constructor(
    private apiSrv: ApiService
  ) { }

  get(collectionId: number): Observable<Collection> {
    return this.apiSrv.get('/v2/collections/' + collectionId + '?include=publisher')
      .pipe(map((data: { data: Collection }) => data.data));
  }

  getItems(collectionId: number): Observable<Item[]> {
    return this.apiSrv.get('/v2/collections/' + collectionId + '/items')
      .pipe(map((data: { data: Item[] }) => data.data));
  }

  getMedia(collectionId: number): Observable<Media[]> {
    return this.apiSrv.get('/v2/collections/' + collectionId + '/medias?include=user')
      .pipe(map((data: { data: Media[], total: number }) => {
        return data.data
      }));
  }

  getUsers(collectionId: number): Observable<User[]> {
    return this.apiSrv.get('/v2/collections/' + collectionId + '/users')
      .pipe(map((data: { data: User[] }) => data.data));
  }

  getTops(collectionId: number): Observable<Tops> {
    return this.apiSrv.get('/v2/collections/' + collectionId + '/tops')
      .pipe(map((tops: any) => {
        let cats: TopsCategory[] = [];
        
        if (tops.data.available) {
          Object.keys(tops.data.categories).forEach((item) => {
            cats.push(tops.data.categories[item]);
          });

          return { available: true, categories: cats };
        } else {
          return { available: false, categories: [] };
        }
      }));
  }

  add(collectionId: number): Observable<string> {
    return this.apiSrv.post('/v2/collections/' + collectionId)
      .pipe(map((data: { message: string }) => data.message));
  }

  setWishlist(collectionId: number, wishlist: string): Observable<any> {
    return this.apiSrv.post('/v2/collections/' + collectionId + '/wishlist', {
      list: wishlist,
      separator: ','
    })
      .pipe(map((data) => data));
  }

  setTradelist(collectionId: number, tradelist: string): Observable<any> {
    return this.apiSrv.post('/v2/collections/' + collectionId + '/tradelist', {
      list: tradelist,
      separator: ','
    })
      .pipe(map((data) => data));
  }

  setCompleted(collectionId: number, status: boolean): Observable<string> {
    if (status) {
      return this.apiSrv.post('/v2/collections/' + collectionId + '/completed')
        .pipe(map((data: { message: string }) => data.message));
    } else {
      return this.apiSrv.delete('/v2/collections/' + collectionId + '/completed')
        .pipe(map((data: { message: string }) => data.message));
    }
  }

  remove(collectionId: number): Observable<string> {
    return this.apiSrv.delete('/v2/collections/' + collectionId + '?message=QUITAR')
      .pipe(map((data: { message: string }) => data.message));
  }
}
