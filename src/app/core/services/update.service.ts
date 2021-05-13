import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Update, UpdateFilter, Meta, UpdateStatistics } from '@models';
import { WithoutUpdate } from '../models/without-update';
import { FilterHttpHelper } from '@shared-helpers';

export interface UpdatesResponse {
  updates: Update[];
  meta: Meta;
}

@Injectable()
export class UpdateService {
  private apiUrl = '/api/updates';
  private apiAdmin = '/api/admin';
  private apiNoUpdate = '/api/admin/users/without_updates';

  constructor(private http: HttpClient) {}

  getUpdates(filter?: UpdateFilter): Observable<UpdatesResponse> {
    const query = FilterHttpHelper.getQueryStrByFilter(filter);

    return this.http.get(`${this.apiUrl}${query}`).pipe(
      map(
        (data: UpdatesResponse) => {
          const updates = data.updates.map(update => new Update(update));
          const meta = data.meta;
          return { updates, meta };
        }
      )
    );
  }

  getNoUpdates(filter?: UpdateFilter): Observable<WithoutUpdate> {
    const query = FilterHttpHelper.getQueryStrByFilter(filter);

    return this.http.get(`${this.apiNoUpdate}${query}`).pipe(
      map((data: any) => new WithoutUpdate(data))
    );
  }

  public getUpdateStatistics(startDate: string, endDate: string): Observable<UpdateStatistics[]> {
    const params = new HttpParams()
      .set('start_date', startDate)
      .set('end_date', endDate);

    return this.http.get(`${this.apiAdmin}/users/updates`, { params }).pipe(
      map((res: any) => UpdateStatistics.newCollection(UpdateStatistics, res.reverse()))
    );
  }
}
