import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, map, shareReplay } from 'rxjs';

import { Collection, Pagination, Suggest, User, UserSummary } from '../models';
import { ApiService } from './api.service';
// import { StorageService } from './storage.service';

@Injectable()
export class SearchService {
  private _searches = new BehaviorSubject<string[]>([]);
  searches$: Observable<string[]> = this._searches.asObservable();

  private $cachedHomeData!: Observable<{
    added: Collection[];
    moreItems: User[];
    moreMedia: User[];
    morePositives: User[];
    popular: Collection[];
    published: Collection[];
    users: User[];
  }>;

  constructor(
    // private storageSrv: StorageService,
    private apiSrv: ApiService
  ) {
    this._initSearches();
  }

  private _initSearches() {
    // if (this.storageSrv.hasKey('searches')) {
    //     this._searches.next(JSON.parse(this.storageSrv.getString('searches')));
    // } else {
    //     this.storageSrv.storeString('searches', JSON.stringify([]));
    // }
  }

  searchByText(query: string): Observable<{
    users: User[];
    totalUsers: number;
    collections: Collection[];
    totalCollections: number;
  }> {
    return this.apiSrv.get('/v2/search?q=' + query).pipe(
      map((data) => {
        let tempUsers: User[] = [];
        let tempUserSummary: UserSummary = {} as UserSummary;

        data.data.users.forEach((user: any) => {
          tempUserSummary = {
            collections: user.collections,
            completed: user.completed,
            negatives: user.negatives,
            positives: user.positives,
            relevance: user.relevance,
            trading: user.trading,
            wishing: user.wishing,
          };

          tempUsers.push({
            ...user,
            userSummary: tempUserSummary,
          });
        });

        return {
          users: tempUsers,
          totalUsers: data.data.totalUsers,
          collections: data.data.collections,
          totalCollections: data.data.totalCollections,
        };
      })
    );
  }

  search(options: {
    query: string;
    page?: number;
    perPage?: number;
    type?: string;
    sortBy?: string;
  }): Observable<{
    collections: Collection[];
    users: User[];
    paginator: Pagination;
  }> {
    return this.apiSrv
      .get(
        '/v3/search?q=' + options.query,
        new HttpParams({
          fromObject: {
            page: options.page || 1,
            perPage: options.perPage || 50,
            type: options.type || 'collection',
            sortBy: options.sortBy || 'relevance',
          },
        })
      )
      .pipe(
        map((data: any) => {
          let tempUsers: User[] = [];
          let tempUserSummary: UserSummary = {} as UserSummary;

          data.users.forEach((user: any) => {
            tempUserSummary = {
              collections: user.hasOwnProperty('collections') ? user.collections : undefined,
              completed: user.hasOwnProperty('completed') ? user.completed : undefined,
              negatives: user.hasOwnProperty('negatives') ? user.negatives : undefined,
              positives: user.hasOwnProperty('positives') ? user.positives : undefined,
              relevance: user.hasOwnProperty('relevance') ? user.relevance : undefined,
              trading: user.hasOwnProperty('trading') ? user.trading : undefined,
              wishing: user.hasOwnProperty('wishing') ? user.wishing : undefined,
            };

            tempUsers.push({
              ...user,
              userSummary: tempUserSummary,
            });
          });

          return {
            collections: data.collections as Collection[],
            users: tempUsers,
            paginator: data.paginator as Pagination,
          };
        })
      );
  }

  // addToHistory(query: string): void {
  //     let q: string[] = [];
  //     q = JSON.parse(this.storageSrv.getString('searches'));
  //     if (!q.includes(query)) {
  //         q.push(query);
  //         this.storageSrv
  //             .storeString('searches', JSON.stringify(q));
  //         this._searches.next(q);
  //     }
  // }

  // clearHistory(): void {
  //     this.storageSrv.storeString('searches', JSON.stringify([]));
  //     this._searches.next([]);
  // }

  getSuggests(query: string): Observable<Suggest[]> {
    return this.apiSrv
      .get('/v2/suggest?q=' + query);
  }

  getHomeData(): Observable<{
    added: Collection[];
    moreItems: User[];
    moreMedia: User[];
    morePositives: User[];
    popular: Collection[];
    published: Collection[];
    users: User[];
  }> {
    if (!this.$cachedHomeData) {
      this.$cachedHomeData = this.apiSrv.get('/v2/home').pipe(
        map((data) => {
          return {
            added: data.data.added.data as Collection[],
            moreItems: data.data.moreItems.data as User[],
            moreMedia: data.data.moreMedia.data as User[],
            morePositives: data.data.morePositives.data as User[],
            popular: data.data.popular.data as Collection[],
            published: data.data.published.data as Collection[],
            users: data.data.users.data as User[],
          };
        }),
        shareReplay(1)
      );
    }

    return this.$cachedHomeData;
  }

  exploreCollections(options: {
    page?: number;
    perPage?: number;
    sortBy?: string;
    publisher?: number;
  }): Observable<{
    paginator: Pagination;
    collections: Collection[];
  }> {
    return this.apiSrv
      .get(
        '/v2/explore/collections',
        new HttpParams({
          fromObject: {
            page: options.page || 1,
            perPage: options.perPage || 100,
            sortBy: options.sortBy || 'published-DESC',
            ...(options.publisher && { publisher: options.publisher })
          },
        })
      )
      .pipe(
        map((data) => {
          return {
            paginator: data.paginator,
            collections: data.collections,
          };
        })
      );
  }
}
