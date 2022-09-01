import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from './api.service';
import {
  Collection,
  CollectionUserData,
  Item,
  Media,
  Tops,
  TopsCategory,
  User,
  UserCollection,
  UserSummary,
} from '../models';

@Injectable()
export class CollectionService {
  constructor(private apiSrv: ApiService) {}

  get(collectionId: number): Observable<Collection> {
    return this.apiSrv
      .get('/v2/collections/' + collectionId + '?include=publisher')
      .pipe(
        map((data: { data: any }) => {
          let tempCollectionUserData = {} as CollectionUserData;
          tempCollectionUserData = {
            collecting: data.data.collecting,
            completed: data.data.completed || undefined,
            wishing: data.data.wishing || undefined,
            trading: data.data.trading || undefined,
            publicComment: data.data.public_comment || undefined,
          };

          return {
            ...(data.data as Collection),
            userData: tempCollectionUserData,
          } as Collection;
        })
      );
  }

  getItems(collectionId: number): Observable<Item[]> {
    return this.apiSrv
      .get('/v2/collections/' + collectionId + '/items')
      .pipe(map((data: { data: Item[] }) => data.data));
  }

  getMedia(collectionId: number): Observable<Media[]> {
    return this.apiSrv
      .get('/v2/collections/' + collectionId + '/medias?include=user')
      .pipe(
        map((data: { data: Media[]; total: number }) => {
          return data.data;
        })
      );
  }

  getUsers(collectionId: number): Observable<User[]> {
    return this.apiSrv.get('/v2/collections/' + collectionId + '/users').pipe(
      map((data: { data: User[] }) => {
        let tempUsers: User[] = [];
        let tempUserSummary: UserSummary = {} as UserSummary;
        let tempUserCollection: UserCollection = {} as UserCollection;

        data.data.forEach((user: any) => {
          tempUserSummary = {
            // collections: user.collections || undefined,
            // completed: user.completed || undefined,
            negatives: user.negatives || undefined,
            positives: user.positives || undefined,
            // relevance: user.relevance || undefined,
            // trading: user.trading || undefined,
            // wishing: user.wishing || undefined,
          };

          tempUserCollection = {
            ...user.summary,
            publicComment: user.summary.public_comment
          };

          tempUsers.push({
            ...user,
            collectionData: tempUserCollection,
            userSummary: tempUserSummary,
          });
        });

        return tempUsers;
      })
    );
  }

  getTops(collectionId: number): Observable<Tops> {
    return this.apiSrv.get('/v2/collections/' + collectionId + '/tops').pipe(
      map((tops: any) => {
        let cats: TopsCategory[] = [];

        if (tops.data.available) {
          Object.keys(tops.data.categories).forEach((item) => {
            cats.push(tops.data.categories[item]);
          });

          return { available: true, categories: cats };
        } else {
          return { available: false, categories: [] };
        }
      })
    );
  }

  add(collectionId: number): Observable<string> {
    return this.apiSrv
      .post('/v2/collections/' + collectionId)
      .pipe(map((data: { message: string }) => data.message));
  }

  setWishlist(
    collectionId: number,
    wishlist: string
  ): Observable<{
    message: string;
    bothListsTotal: number;
    bothListDetails: string | null;
  }> {
    return this.apiSrv
      .post('/v2/collections/' + collectionId + '/wishlist', {
        list: wishlist,
        separator: ',',
      })
      .pipe(
        map((data: any) => {
          return {
            message: data.message,
            bothListsTotal: data.bothListsTotal,
            bothListDetails: data.bothListDetails,
          };
        })
      );
  }

  setTradelist(
    collectionId: number,
    tradelist: string
  ): Observable<{
    message: string;
    bothListsTotal: number;
    bothListDetails: string | null;
  }> {
    return this.apiSrv
      .post('/v2/collections/' + collectionId + '/tradelist', {
        list: tradelist,
        separator: ',',
      })
      .pipe(
        map((data: any) => {
          return {
            message: data.message,
            bothListsTotal: data.bothListsTotal,
            bothListDetails: data.bothListDetails,
          };
        })
      );
  }

  setCompleted(collectionId: number, status: boolean): Observable<string> {
    if (status) {
      return this.apiSrv
        .post('/v2/collections/' + collectionId + '/completed')
        .pipe(map((data: { message: string }) => data.message));
    } else {
      return this.apiSrv
        .delete('/v2/collections/' + collectionId + '/completed')
        .pipe(map((data: { message: string }) => data.message));
    }
  }

  addComment(collectionId: number, comment: string): Observable<string> {
    return this.apiSrv
      .post('/v2/collections/' + collectionId + '/comment', {
        comment: comment,
      })
      .pipe(map((data: { message: string }) => data.message));
  }

  removeComment(collectionId: number): Observable<string> {
    return this.apiSrv
      .delete('/v2/collections/' + collectionId + '/comment')
      .pipe(map((data: { message: string }) => data.message));
  }

  remove(collectionId: number): Observable<string> {
    return this.apiSrv
      .delete('/v2/collections/' + collectionId + '?message=QUITAR')
      .pipe(map((data: { message: string }) => data.message));
  }
}
