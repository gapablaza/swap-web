import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  Collection,
  Evaluation,
  Item,
  Media,
  Trades,
  TradesUser,
  TradesUserCollection,
  TradesWithUser,
  TradesWithUserCollection,
  User,
} from '../models';
import { ApiService } from './api.service';
// import { EXAMPLE_USER, EXAMPLE_USER_COLLECTION, EXAMPLE_USER_COLLECTIONS } from './example-user.service';

@Injectable()
export class UserService {
  constructor(private apiSrv: ApiService) {}

  get(userId: number): Observable<User> {
    // return of(EXAMPLE_USER);
    return this.apiSrv
      .get('/users/' + userId)
      .pipe(map((data: { data: User }) => data.data));
  }

  getCollections(
    userId: number
  ): Observable<{ collections: Collection[]; trades: any }> {
    return this.apiSrv
      .get('/users/' + userId + '/collections?include=publisher')
      .pipe(
        map((data: { data: Collection[]; trades: boolean }) => {
          return { collections: data.data, trades: data.trades };
        })
      );
    // return of({ collections: EXAMPLE_USER_COLLECTIONS, trades: false });
  }

  getCollectionInfo(
    userId: number,
    collectionId: number
  ): Observable<{ info: Collection; tradelist: Item[]; wishlist: Item[] }> {
    return this.apiSrv
      .get(
        '/users/' +
          userId +
          '/collections/' +
          collectionId +
          '?include=publisher'
      )
      .pipe(
        map((data: any) => {
          return {
            info: data.data.info,
            tradelist: data.data.tradelist,
            wishlist: data.data.wishlist,
          };
        })
      );
    // .pipe(map(data => data.data));
  }

  getEvaluations(userId: number): Observable<Evaluation[]> {
    return this.apiSrv
      .get('/users/' + userId + '/evaluations?include=user')
      .pipe(
        map((data: any) => {
          const evals: Evaluation[] = [];

          // converts object with array form to array
          Object.keys(data.list).forEach((item) => {
            let model = new Evaluation();
            Object.assign(model, data.list[item]);

            // converts object with prevEvals to array
            if (data.list[item].previousEvaluationsCounter) {
              let prevEvalArray: Evaluation[] = [];
              Object.keys(data.list[item].previousEvaluationsData).forEach(
                (key) => {
                  prevEvalArray.push(
                    data.list[item].previousEvaluationsData[key] as Evaluation
                  );
                }
              );
              model = { ...model, previousEvaluationsData: prevEvalArray };
            }

            evals.push(model);
          });
          return evals;
        })
      );
  }

  getEvaluatorStatus(userId: number): Observable<any> {
    return this.apiSrv
      .get('/users/' + userId + '/evaluations?include=user')
      .pipe(map((data) => data));
  }

  addEvaluation(
    userId: number,
    typeId: number,
    commentText: string
  ): Observable<string> {
    return this.apiSrv
      .post('/users/' + userId + '/evaluations', {
        type: typeId,
        comment: commentText,
      })
      .pipe(map((data: { message: string }) => data.message));
  }

  getMedia(userId: number): Observable<Media[]> {
    return this.apiSrv
      .get('/users/' + userId + '/medias?include=collection.publisher')
      .pipe(map((data) => data.data));
    // return of({ collections: EXAMPLE_USER_COLLECTIONS, trades: false });
  }

  getTradesWithAuthUser(userId: number): Observable<TradesWithUser> {
    return this.apiSrv
      .get('/users/' + userId + '/collections?include=publisher')
      .pipe(
        map((data: { data: Collection[]; trades: any }) => {
          if (data.trades) {
            let collectionsArray: TradesWithUserCollection[] = [];

            // converts object with array form to array
            Object.keys(data.trades.collections).forEach((item) => {
              collectionsArray.push(data.trades.collections[item]);
            });

            return {
              showTrades: true,
              collections: collectionsArray,
              total: data.trades.total,
            };
          } else {
            return { showTrades: false, collections: [], total: 0 };
          }
        })
      );
  }

  getTrades(data?: {
    days?: number,
    location?: number,
    page?: number,
    collections?: string
  }): Observable<Trades> {
    let params: any = {};

    if (data && data.days) { 
      params['days'] = data.days 
    } else {
      params['days'] = 7;
    };

    if (data && data.location) { 
      params['location'] = data.location 
    } else {
      params['location'] = 2;
    };

    if (data && data.page) { 
      params['page'] = data.page 
    } else {
      params['page'] = 1;
    };

    if (data && data.collections) { params['collections'] = data.collections };

    return this.apiSrv
      .get('/me/trades', new HttpParams({ fromObject: params }))
      .pipe(
        map((data) => {
          let tempCollections: TradesUserCollection[] = [];
          let tempUsers: TradesUser[] = [];
          
          data.users.forEach((user: any) => {

            tempCollections = [];
            // converts object with array form to array
            Object.keys(user.collections).forEach((item) => {
              tempCollections.push({
                ...user.collections[item],
                collectionData: user.collections[item].data
              });
            });

            tempUsers.push({
              collections: tempCollections,
              userData: {
                ...user.data,
                tradesWithUser: user.data.tradesWithuser
              },
              order: user.data
            })
          })

          return {
            allowedUsers: data.allowedUsers,
            paginate: data.paginate,
            totalTrades: data.totalTrades,
            totalUsers: data.totalUsers,
            uniqueTrades: data.uniqueTrades,
            user: tempUsers,
          }
        })
      );
  }

  // getCollectionsFromUser(id: number): Collection[] {
  //   return EXAMPLE_USER_COLLECTIONS;
  // }

  // getCollectionFromUser(userId: number, collectionId: number) {
  //   return EXAMPLE_USER_COLLECTION;
  // }
}
