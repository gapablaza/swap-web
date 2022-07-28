import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Collection, Pagination, User } from '../models';
import { ApiService } from './api.service';
// import { StorageService } from './storage.service';

@Injectable()
export class SearchService {
    private _searches = new BehaviorSubject<string[]>([]);
    searches$: Observable<string[]> = this._searches.asObservable();

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
      users: User[],
      totalUsers: number,
      collections: Collection[],
      totalCollections: number
    }> {
        return this.apiSrv.get('/v2/search?q=' + query)
          .pipe(map(data => data.data));
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

    getHomeData(): Observable<{ 
      added: Collection[], 
      moreItems: User[], 
      moreMedia: User[], 
      popular: Collection[], 
      published: Collection[], 
      users: User[] 
    }> {
      return this.apiSrv.get('/v2/home')
        .pipe(map(data => {
          return {
            added: data.data.added.data as Collection[],
            moreItems: data.data.moreItems.data as User[],
            moreMedia: data.data.moreMedia.data as User[],
            popular: data.data.popular.data as Collection[],
            published: data.data.published.data as Collection[],
            users: data.data.users.data as User[]
          };
        }));
    }

    exploreCollections(options: { page?: number, perPage?: number, sortBy?: string }): Observable<{
      paginator: Pagination,
      collections: Collection[]
    }> {
      return this.apiSrv.get(
          '/v2/explore/collections',
          new HttpParams({ fromObject: { 
            page: options.page || 1, 
            perPage: options.perPage || 100,
            sortBy: options.sortBy || 'published-DESC',
          } })
        )
        .pipe(map(data => {
          return {
            paginator: data.paginator,
            collections: data.collections,
          };
        }));
    }
}
