import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CalendarEvent, Tag } from '@models';
import { map } from 'rxjs/operators';

@Injectable()
export class EventService {
  private apiUrl = '/api/events';
  private apiUrltags = '/api/event_tags';

  constructor(
    private http: HttpClient,
  ) {}

  public getEvent(eventId: number): Observable<CalendarEvent> {
    return this.http.get<CalendarEvent[]>(`${this.apiUrl}/${eventId}`)
      .pipe(map(res => CalendarEvent.new(CalendarEvent, res)));
  }

  public getEvents(params?: HttpParams): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(this.apiUrl, { params })
      .pipe(map(res => CalendarEvent.newCollection<CalendarEvent>(CalendarEvent, res)));
  }

  public getTags(): Observable<Tag[]> {
      return this.http.get<Tag[]>(this.apiUrltags)
        .pipe(map(res => CalendarEvent.newCollection<Tag>(Tag, res)));
  }

  public addEvent(event: CalendarEvent): Observable<CalendarEvent> {
    event.start.setHours(0, 0, 0, 0);
    event.end.setHours( 23, 59, 59, 999);
    return this.http.post<CalendarEvent>(this.apiUrl, event._toJSON())
      .pipe(map(res => CalendarEvent.new(CalendarEvent, res)));
  }

  public updateEvent(event: CalendarEvent): Observable<CalendarEvent> {
    event.start.setHours(0, 0, 0, 0);
    event.end.setHours( 23, 59, 59, 999);
    return this.http.put(`${this.apiUrl}/${event.id}`, event._toJSON())
      .pipe(map(res => CalendarEvent.new(CalendarEvent, res)));
  }

  public approve(id: number): Observable<CalendarEvent> {
    return this.http.post<CalendarEvent>(`${this.apiUrl}/${id}/approve`, {})
      .pipe(map(res => CalendarEvent.new(CalendarEvent, res)));
  }

  public disapprove(id: number, description: string): Observable<CalendarEvent> {
    return this.http.post<CalendarEvent>(`${this.apiUrl}/${id}/disapprove`, { description })
      .pipe(map(res => CalendarEvent.new(CalendarEvent, res)));
  }

  public deleteEvent(eventId: number): Observable<CalendarEvent> {
    return this.http.delete<CalendarEvent>(`${this.apiUrl}/${eventId}`);
  }
}
