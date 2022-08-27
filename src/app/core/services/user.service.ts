import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  Collection,
  CollectionUserData,
  Evaluation,
  Media,
  Trades,
  TradesUser,
  TradesUserCollection,
  TradesWithUser,
  TradesWithUserCollection,
  User,
  UserSummary,
} from '../models';
import { ApiService } from './api.service';

@Injectable()
export class UserService {
  constructor(private apiSrv: ApiService) {}

  get(userId: number): Observable<User> {
    return this.apiSrv.get('/v2/users/' + userId).pipe(
      map((data: { data: any }) => {
        let tempUser: User = {} as User;
        let tempUserSummary: UserSummary = {} as UserSummary;

        tempUserSummary = {
          collections: data.data.collections,
          completed: data.data.completedCollections,
          negatives: data.data.negatives,
          positives: data.data.positives,
          trading: data.data.trading,
          wishing: data.data.wishing,
        };

        tempUser = {
          ...(data.data as User),
          userSummary: tempUserSummary,
        };

        return tempUser;
      })
    );
  }

  getCollections(
    userId: number
  ): Observable<{ collections: Collection[]; trades: any }> {
    return this.apiSrv
      .get('/v2/users/' + userId + '/collections?include=publisher')
      .pipe(
        map((data: { data: any[]; trades: boolean }) => {
          let tempCollections: Collection[] = [];
          data.data.forEach((col) => {
            tempCollections.push({
              ...(col as Collection),
              userSummary: col.summary,
            } as Collection);
          });
          return { collections: tempCollections, trades: data.trades };
        })
      );
  }

  getCollectionInfo(
    userId: number,
    collectionId: number
  ): Observable<Collection> {
    return this.apiSrv
      .get(
        '/v2/users/' +
          userId +
          '/collections/' +
          collectionId +
          '?include=publisher'
      )
      .pipe(
        map((data: any) => {
          let tempCollectionUserData = {} as CollectionUserData;
          tempCollectionUserData = {
            collecting: data.data.info.collecting,
            completed: data.data.info.completed,
            wishing: data.data.info.wishing,
            trading: data.data.info.trading,
            updated: data.data.info.updated,
            tradelist: data.data.tradelist,
            wishlist: data.data.wishlist,
          };

          return {
            ...(data.data.info as Collection),
            userData: tempCollectionUserData,
          } as Collection;
        })
      );
  }

  getEvaluations(userId: number): Observable<{
    evaluations: Evaluation[],
    disabled: boolean,
    disabledData?: {
      disabledForAntiquity: boolean | number,
      disabledForTime: boolean | number,
      disabledForUser: boolean,
      disabledUser: boolean,
    };
  }> {
    return this.apiSrv
      .get('/v2/users/' + userId + '/evaluations?include=user')
      .pipe(
        map((data: any) => {
          const evals: Evaluation[] = [];

          // converts object with array form to array
          Object.keys(data.list).forEach((item) => {
            let tempUser: User = {} as User;
            let tempUserSummary: UserSummary = {} as UserSummary;

            tempUserSummary = {
              negatives: data.list[item].user.data.negatives,
              positives: data.list[item].user.data.positives,
            };

            tempUser = {
              ...data.list[item].user.data,
              userSummary: tempUserSummary,
            };

            let model = {
              ...data.list[item],
              user: {
                data: tempUser,
              },
            } as Evaluation;

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
              model = {
                ...model,
                previousEvaluationsData: prevEvalArray,
              };
            }

            evals.push(model);
          });
          return {
            evaluations: evals,
            disabled: data.disabled,
            disabledData: {
              disabledForAntiquity: data.disabledForAntiquity || undefined,
              disabledForTime: data.disabledForTime || undefined,
              disabledForUser: data.disabledForUser || undefined,
              disabledUser: data.disabledUser || undefined,
            },
          };
        })
      );
  }

  // getEvaluatorStatus(userId: number): Observable<any> {
  //   return this.apiSrv
  //     .get('/v2/users/' + userId + '/evaluations?include=user')
  //     .pipe(map((data) => data));
  // }

  addEvaluation(
    userId: number,
    typeId: number,
    commentText: string
  ): Observable<string> {
    return this.apiSrv
      .post('/v2/users/' + userId + '/evaluations', {
        type: typeId,
        comment: commentText,
      })
      .pipe(map((data: { message: string }) => data.message));
  }

  getMedia(userId: number): Observable<Media[]> {
    return this.apiSrv
      .get('/v2/users/' + userId + '/medias?include=collection.publisher')
      .pipe(map((data) => data.data));
  }

  getTradesWithAuthUser(userId: number): Observable<TradesWithUser> {
    return this.apiSrv
      .get('/v2/users/' + userId + '/collections?include=publisher')
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
    days?: number;
    location?: number;
    page?: number;
    collections?: string;
  }): Observable<Trades> {
    let params: any = {};

    if (data && data.days) {
      params['days'] = data.days;
    } else {
      params['days'] = 7;
    }

    if (data && data.location) {
      params['location'] = data.location;
    } else {
      params['location'] = 2;
    }

    if (data && data.page) {
      params['page'] = data.page;
    } else {
      params['page'] = 1;
    }

    if (data && data.collections) {
      params['collections'] = data.collections;
    }

    return this.apiSrv
      .get('/v2/me/trades', new HttpParams({ fromObject: params }))
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
                collectionData: user.collections[item].data,
              });
            });

            tempUsers.push({
              collections: tempCollections,
              userData: {
                ...user.data,
                tradesWithUser: user.data.tradesWithuser,
              },
              order: user.data,
            });
          });

          return {
            allowedUsers: data.allowedUsers,
            paginate: data.paginate,
            totalTrades: data.totalTrades,
            totalUsers: data.totalUsers,
            uniqueTrades: data.uniqueTrades,
            user: tempUsers,
          };
        })
      );
  }
}
