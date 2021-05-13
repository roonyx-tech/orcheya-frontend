import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Section } from '@models';
import { map } from 'rxjs/operators';

@Injectable()
export class FaqService {
  private apiUrl = '/api/faq';

  constructor(
    private http: HttpClient,
  ) {}

  public getSections(): Observable<Section[]> {
    return this.http.get<Section[]>(this.apiUrl)
      .pipe(map(res => Section.newCollection<Section>(Section, res)));
  }

  public getSection(id: number): Observable<Section> {
    return this.http.get<Section>(`${this.apiUrl}/${id}`);
  }
}
