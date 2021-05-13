import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Section } from '@models';

const ADMIN_SECTIONS_URL = '/api/admin/sections';

@Injectable()
export class FaqService {

  constructor(private http: HttpClient) { }

  public getSections(): Observable<Section[]> {
    return this.http.get<Section[]>(ADMIN_SECTIONS_URL).pipe(
      map((response: any) => Section.newCollection(Section, response))
    );
  }
  public editSection(section: Section): Observable<Section> {
    return this.http.put<Section>(`${ADMIN_SECTIONS_URL}/${section.id}`, section._toJSON()).pipe(
      map((response: any) => Section.new(Section, response))
    );
  }

  public addSection(section: Section): Observable<Section> {
    return this.http.post<Section>(ADMIN_SECTIONS_URL, section._toJSON()).pipe(
      map( (response: any) => Section.new(Section, response))
    );
  }

  public deleteSection(section: Section): Observable<boolean> {
    return this.http.delete(`${ADMIN_SECTIONS_URL}/${section.id}`).pipe(map(_ => true));
  }
}
