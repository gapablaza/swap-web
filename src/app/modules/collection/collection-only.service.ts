import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Collection } from '../../core/models';

@Injectable()
export class CollectionOnlyService {
  // private _collection: Collection = {} as Collection;
  private _collection = new BehaviorSubject<Collection>({} as Collection);
  collection$: Observable<Collection> = this._collection.asObservable();

  constructor() { }

  setCurrentCollection(col: Collection) {
    // this._collection = col;
    this._collection.next(col);
  }

  getCurrentCollection() {
    // return this._collection;
    return this._collection.value;
  }

  cleanCurrentCollection() {
    // this._collection = {} as Collection;
    this._collection.next({} as Collection);
  }
}
