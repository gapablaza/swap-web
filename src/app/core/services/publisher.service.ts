import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Collection, Publisher } from '../models';
import { ApiService } from './api.service';

@Injectable()
export class PublisherService {
  constructor(private apiSrv: ApiService) {}

  get(publisherId: number): Observable<{
    data: Publisher;
    lastCollections: Collection[];
  }> {
    return this.apiSrv
      .get(`/v2/publishers/${publisherId}`);
  }

  list(): Observable<Publisher[]> {
    return this.apiSrv
        .get('/v2/publishers')
        .pipe(map((resp: { data: Publisher[] }) => resp.data));
  }
}
