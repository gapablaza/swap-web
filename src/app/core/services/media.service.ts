import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Media, MediaUpload } from '../models';

import { ApiService } from './api.service';

@Injectable()
export class MediaService {
  constructor(private http: HttpClient, private apiSrv: ApiService) {}

  setLike(id: number, likes: boolean): Observable<string> {
    if (likes) {
      return this.apiSrv
        .post('/v2/media/' + id + '/like')
        .pipe(map((data: { message: string }) => data.message));
    } else {
      return this.apiSrv
        .delete('/v2/media/' + id + '/like')
        .pipe(map((data: { message: string }) => data.message));
    }
  }

  add(mediaData: MediaUpload, img: string): Observable<number> {
    return this.apiSrv
      .post('/v2/media', {
        description: mediaData.description,
        url: mediaData.url,
        mediaTypeId: mediaData.mediaTypeId,
        collectionId: mediaData.collectionId,
      })
      .pipe(
        take(1),
        map((data) => Number(data.newId)),
        concatMap((mediaId) =>
          this.http
            .post(
              `https://api.cloudinary.com/v1_1/${environment.cloudinary.cloudName}/image/upload`,
              JSON.stringify({
                file: img,
                upload_preset: environment.cloudinary.uploadPreset,
                public_id: String(mediaId),
                folder: `${environment.cloudinary.site}/collectionMedia`,
                tags: `cid_${mediaId},collectionMedia`,
              })
            )
            .pipe(
              take(1),
              map(() => mediaId)
            )
        )
      );
  }

  listForModerationByUser(): Observable<Media[]> {
    return this.apiSrv
      .get('/v2/media/forModerationByMe?include=collection.publisher')
      .pipe(
        map((data: { data: Media[]; total: number }) => {
          return data.data;
        })
      );
  }

  listByCollection(id: number): Observable<{ medias: Media[]; total: number }> {
    return this.apiSrv.get(`/v2/collections/${id}/medias?include=user`).pipe(
      map((data: any) => {
        if (data.total > 0) {
          return {
            medias: data.data as Media[],
            total: data.total,
          };
        } else {
          return {
            medias: data.medias as Media[],
            total: data.total,
          };
        }
      })
    );
  }

  delete(id: number): Observable<string> {
    return this.apiSrv
      .delete(`/v2/media/${id}`)
      .pipe(map((data: { message: string }) => data.message));
  }

  waitingModeration(): Observable<Media[]> {
    return this.apiSrv
      .get(`/v2/media/forModeration?include=collection.publisher,user`)
      .pipe(map((data: { data: Media[] }) => data.data));
  }

  sanction(mediaId: number, sanctionId: number): Observable<string> {
    return this.apiSrv
      .post(`/v2/media/${mediaId}/sanction`, {
        status: sanctionId,
      })
      .pipe(map((data: { message: string }) => data.message));
  }
}
