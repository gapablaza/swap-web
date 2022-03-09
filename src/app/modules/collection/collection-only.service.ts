import { Injectable } from '@angular/core';

import { Collection } from '../../core/models';

@Injectable()
export class CollectionOnlyService {
  private _collection: Collection = {} as Collection;

  constructor() { }

  setCurrentCollection(col: Collection) {
    this._collection = col;
  }

  getCurrentCollection() {
    return this._collection;
  }

  cleanCurrentCollection() {
    this._collection = {} as Collection;
  }
}
