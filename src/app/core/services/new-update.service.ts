import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Update } from '@models';

@Injectable()
export class NewUpdateService {
  private getUpdatePath = '/api/users';
  private apiPath = '/api/updates';

  constructor(private http: HttpClient) {}

  public getLastUpdate(id: number, date: string): Observable<any> {
    return this.http.get(
      `${this.getUpdatePath}/${id}/day_info`,
      { params: new HttpParams().set('date', date) }
    ).pipe(map(res => res));
  }

  public sendNewUpdate(update: Update): Observable<any> {
    return this.http.post(this.apiPath, update).pipe(map(res => res));
  }

  public editOldUpdate(update: Update): Observable<any> {
    return this.http.put(`${this.apiPath}/${update.id}`, update).pipe(map(res => res));
  }
}
