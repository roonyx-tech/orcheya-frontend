import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateProjectProgress, UserWorktime, UserWorktimeProjects } from '@models';


const API_PATH = id => `/api/users/${id}/worktime`;
const API_PATH_PROJECTS = id => `/api/users/${id}/worktime_by_projects`;

@Injectable()
export class UserWorktimeService {
  constructor(private http: HttpClient) {}

  public load(id: number): Observable<UserWorktime> {
    return this.http.get(API_PATH(id)).pipe(
      map((res: any) => new UserWorktime(res))
    );
  }

  public loadPercent(id: number, params: DateProjectProgress): Observable<UserWorktimeProjects> {
    const httpParams = new HttpParams()
      .set('start_date', params.start_date)
      .set('finish_date', params.finish_date);
    return this.http.get(API_PATH_PROJECTS(id), {params: httpParams}).pipe(
      map((res: any) => {
        return new UserWorktimeProjects(res);
      })
    );
  }
}
