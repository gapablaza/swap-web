import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import {
  ChecklistItem,
  NewChecklist,
  NewCollection,
  Pagination,
  Publisher,
  User,
} from '../models';

import { ApiService } from './api.service';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class NewCollectionService {
  constructor(private apiSrv: ApiService) {}

  get(
    id: number
  ): Observable<{
    newCollection: NewCollection;
    checklists: NewChecklist[];
    votes: User[];
  }> {
    return this.apiSrv.get('/v3/newCollections/' + id).pipe(
      map(
        (data: {
          newCollection: { data: NewCollection };
          checklists: { data: NewChecklist[] };
          votes: { data: User[] };
        }) => {
          return {
            newCollection: data.newCollection.data,
            checklists: data.checklists.data,
            votes: data.votes.data,
          };
        }
      )
    );
  }

  add(data: {
    name: string;
    year: number;
    publisher: number;
    description?: string;
    numbers?: string;
    cover: number;
  }): Observable<{ message: string; newId: number }> {
    return this.apiSrv
      .post('/v3/newCollections', {
        title: data.name,
        year: data.year,
        publisher: data.publisher,
        description: data.description ? data.description : null,
        numbers: data.numbers ? data.numbers : null,
        cover: data.cover,
      })
      .pipe(map((data: { message: string; newId: number }) => data));
  }

  getPublishers(): Observable<Publisher[]> {
    return this.apiSrv
      .get('/v2/publishers')
      .pipe(map((resp: { data: Publisher[] }) => resp.data));
  }

  uploadImage(newImage: string): Observable<{ id: number; base64: string }> {
    return this.apiSrv
      .post('/v3/images', {
        image: newImage,
        functionalityId: 1,
      })
      .pipe(
        take(1),
        map((data: { newId: number; base64: string }) => {
          return { id: data.newId, base64: data.base64 };
        })
      );
  }

  setVote(collectionId: number, vote: boolean): Observable<string> {
    if (vote) {
      return this.apiSrv
        .post('/v3/newCollections/' + collectionId + '/votes')
        .pipe(map((data: { message: string }) => data.message));
    } else {
      return this.apiSrv
        .delete('/v3/newCollections/' + collectionId + '/votes')
        .pipe(map((data: { message: string }) => data.message));
    }
  }

  addChecklist(
    collectionId: number,
    newItems: ChecklistItem[]
  ): Observable<{ message: string; newId: number }> {
    return this.apiSrv
      .post(`/v3/newCollections/${collectionId}/checklist`, {
        items: JSON.stringify(newItems),
      })
      .pipe(map((data: { message: string; newId: number }) => data));
  }

  list(options: {
    query?: string;
    status?: number;
    perPage?: number;
    page?: number;
    sortBy?: string;
  }): Observable<{
    newCollections: NewCollection[];
    paginator: Pagination;
  }> {
    return this.apiSrv.get(
      '/v3/newCollections?q=' + options.query,
      new HttpParams({
        fromObject: {
          status: options.status || '',
          perPage: options.perPage || 20,
          page: options.page || 1,
          sortBy: options.sortBy || 'requested-DESC',
        },
      })
    );
  }
}
