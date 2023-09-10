import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import {
  ChecklistItem,
  History,
  NewChecklist,
  NewCollection,
  NewCollectionComment,
  Pagination,
  Publisher,
  User,
} from '../models';

import { ApiService } from './api.service';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class NewCollectionService {
  constructor(private apiSrv: ApiService) {}

  get(id: number): Observable<{
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

  getComments(id: number): Observable<NewCollectionComment[]> {
    return this.apiSrv
      .get(`/v3/newCollections/${id}/comments`)
      .pipe(map((resp: { data: NewCollectionComment[] }) => resp.data));
  }

  addComment(
    collectionId: number,
    newComment: string
  ): Observable<{ message: string; newId: number }> {
    return this.apiSrv
      .post(`/v3/newCollections/${collectionId}/comments`, {
        comment: newComment,
      })
      .pipe(map((data: { message: string; newId: number }) => data));
  }

  add(data: {
    name: string;
    year: number;
    released?: string;
    publisher: number;
    description: string;
    details?: string;
    numbers?: string;
    image: number;
    cover?: number;
  }): Observable<{ message: string; newId: number }> {
    return this.apiSrv
      .post('/v3/newCollections', {
        title: data.name,
        year: data.year,
        released: data.released ? data.released : null,
        publisher: data.publisher,
        description: data.description,
        details: data.details ? data.details : null,
        numbers: data.numbers ? data.numbers : null,
        image: data.image,
        cover: data.cover ? data.cover : null,
      })
      .pipe(map((data: { message: string; newId: number }) => data));
  }

  update(data: {
    id: number;
    name: string;
    year: number;
    released?: string;
    publisher: number;
    description: string;
    details?: string;
    numbers?: string;
    image: number;
    cover?: number;
  }): Observable<string> {
    return this.apiSrv
      .put(`/v3/newCollections/${data.id}`, {
        title: data.name,
        year: data.year,
        released: data.released ? data.released : null,
        publisher: data.publisher,
        description: data.description,
        details: data.details ? data.details : null,
        numbers: data.numbers ? data.numbers : null,
        image: data.image,
        cover: data.cover ? data.cover : null,
      })
      .pipe(map((data: { message: string }) => data.message));
  }

  sanction(data: {
    newCollectionId: number;
    newStatus: number;
    comment: string;
  }): Observable<string> {
    return this.apiSrv
      .put(`/v3/newCollections/${data.newCollectionId}/sanction`, {
        comment: data.comment,
        sanction: data.newStatus,
      })
      .pipe(map((data: { message: string }) => data.message));
  }

  setChecklist(data: {
    newCollectionId: number;
    checklistId: number;
  }): Observable<string> {
    return this.apiSrv
      .put(`/v3/newCollections/${data.newCollectionId}/setChecklist`, {
        checklist: data.checklistId,
      })
      .pipe(map((data: { message: string }) => data.message));
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

  uploadImageToCloudinary(
    newImage: string
  ): Observable<{ message: string; id: number; url: string }> {
    return this.apiSrv
      .post('/v3/images/cloudinary', {
        image: newImage,
        functionalityId: 1,
      })
      .pipe(
        take(1),
        map((data: { message: string; newId: number; url: string }) => {
          return { message: data.message, id: data.newId, url: data.url };
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

  publish(
    newCollectionId: number,
    security: string
  ): Observable<{ message: string; newId: number }> {
    return this.apiSrv
      .post(`/v3/newCollections/${newCollectionId}/publish`, {
        security: security,
      })
      .pipe(map((data: { message: string; newId: number }) => data));
  }

  getHistory(newCollectionId: number): Observable<History[]> {
    return this.apiSrv
      .get(`/v3/newCollections/${newCollectionId}/history`)
      .pipe(map((resp: { data: History[] }) => resp.data));
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
          perPage: options.perPage || 10,
          page: options.page || 1,
          sortBy: options.sortBy || 'requested-DESC',
        },
      })
    );
  }
}
