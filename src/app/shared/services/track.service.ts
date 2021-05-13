import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class TrackService {
  private apiUrl = '/api/track_event';

  constructor(private http: HttpClient) {}

  send(eventName: string): void {
    const params = new HttpParams().set('e', eventName);
    this.http.get(this.apiUrl, { params }).subscribe(_ => null);
  }

  track(event: string): void {
    this.send('fe_' + event);
  }

  trackUrl(path: string): void {
    if ((path !== '/sign-in') && (path !== '/reset-password')) {
      const newPath = path
        .split('/')
        .map((item: any) => !item || isNaN(item) ? item : 'num')
        .join('_')
        .replace(/[^a-zA-Z]/gi, '_');
      const eventName = 'fu' + newPath;
      this.send(eventName);
    }
  }
}


