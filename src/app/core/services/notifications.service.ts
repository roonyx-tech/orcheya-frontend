import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class NotificationsService {

  constructor(private http: HttpClient) {}

  public read(id: number): Observable<boolean> {
    return this.http.post(`/api/notifications/${id}/read`, null).pipe(map(_ => true));
  }

  public readAll(): Observable<boolean> {
    return this.http.post(`/api/notifications/read_all`, null).pipe(map(_ => true));
  }
}
