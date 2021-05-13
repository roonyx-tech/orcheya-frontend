import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserLink } from '@models';

@Injectable()
export class UserLinksService {
  public userLinksData: UserLink[] = [];
  public links = new Subject<UserLink[]>();

  constructor(private http: HttpClient) {}

  public getUserLinks(userId: number): Observable<boolean> {
    const url = this._makeUrl(userId);
    return this.http.get(url).pipe(
      map((response: UserLink[]) => {
        this.userLinksData.splice(0, this.userLinksData.length);
        response.forEach(link => {
          this.userLinksData.push(link);
        });
        this.links.next(response);
        return !!this.links;
      })
    );
  }

  private _makeUrl(id: number): string {
    return `/api/users/${id}/links`;
  }

  public newUserLink(link: UserLink, id: number): Observable<UserLink> {
    return this.http.post(this._makeUrl(id), link).pipe(
      map((response: UserLink) => {
        this.userLinksData.push(response);
        return response;
      })
    );
  }

  public updateUserLink(link: UserLink, id: number): Observable<UserLink> {
    return this.http.put(`${this._makeUrl(id)}/${link.id}`, link).pipe(
      map((response: UserLink) => {
        const updatedLink = this.userLinksData.find((l: UserLink) => {
          return l.id === link.id;
        });
        updatedLink.link = link.link;
        updatedLink.kind = response.kind;
        return updatedLink;
      })
    );
  }

  public removeUserLink(
    id: number,
    userId: number,
    index: number
  ): Observable<object> {
    return this.http.delete(`${this._makeUrl(userId)}/${id}`).pipe(
      map(_ => this.userLinksData.splice(index, 1))
    );
  }
}
