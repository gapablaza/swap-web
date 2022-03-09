import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Collection, User } from '../models';
import { EXAMPLE_RAW_HOME } from '../constants';
import { ApiService } from './api.service';
// import { StorageService } from './storage.service';


@Injectable({ providedIn: 'root' })
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

    searchByText(query: string): Observable<any> {
        return this.apiSrv.get('/search?q=' + query)
          .pipe(map(data => data.data));
        // return of(EXAMPLE_SEARCH);
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

    // getHomeData(): Observable<any> {
    //     return this.apiSrv.get('/home')
    //       .pipe(map(data => data.data));
    //   }

    getHomeData(): Observable<{ added: Collection[], moreItems: User[], moreMedia: User[], popular: Collection[], published: Collection[], users: User[] }> {
      // return this.apiSrv.get('/home')
      return of(EXAMPLE_RAW_HOME)
        .pipe(map((data: any) => {
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
}
