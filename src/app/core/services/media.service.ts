import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from './api.service';

@Injectable()
export class MediaService {
  constructor(private apiSrv: ApiService) {}

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
}
