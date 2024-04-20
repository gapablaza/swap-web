import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ReportType } from '../models';
import { ApiService } from './api.service';

@Injectable()
export class ReportService {
  constructor(private apiSrv: ApiService) {}

  listTypes(objectTypeId: number): Observable<ReportType[]> {
    return this.apiSrv
      .get(`/v3/reports/types/${objectTypeId}`)
      .pipe(map((resp: { data: ReportType[] }) => resp.data));
  }

  add(
    objectTypeId: number,
    objectId: number,
    categoryId: number,
    observation: string
  ): Observable<string> {
    let url = '';
    switch (objectTypeId) {
        case 7: {
            url = '/v3/reports/user/';
            break;
        } 
        case 8: {
            url = '/v3/reports/evaluation/';
            break;
        }
        default: {
            url = '/v3/reports/default/';
        }
    }
    
    return this.apiSrv
      .post(url + objectId, {
        category: categoryId,
        observation: observation,
      })
      .pipe(map((data: { message: string }) => data.message));
  }
}
