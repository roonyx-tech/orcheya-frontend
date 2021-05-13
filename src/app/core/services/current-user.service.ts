import { Injectable } from '@angular/core';
import {
  HttpClient, HttpEvent, HttpEventType, HttpHeaders,
  HttpProgressEvent, HttpRequest,
} from '@angular/common/http';

import { Observable, Observer, Subject, Subscription } from 'rxjs';
import { map, last, catchError } from 'rxjs/operators';
import { Model } from 'tsmodels';
import {
  User,
  Timing,
  IUserEdit,
  InvitationRespone,
  InviteUser,
  UpdateFavoriteAchievement
} from '@models';
import { OWNER } from '@consts';

@Injectable()
export class CurrentUserService extends User {
  private apiProfilePath = '/api/profile';
  private apiUsersPath = '/api/users';
  private apiAdminUsersPath = '/api/admin/users';
  public progressSubject = new Subject<number>();
  public avatarSubscription: Subscription;

  constructor(private http: HttpClient) {
    super();
  }

  static setTokenByHeaders(headers: HttpHeaders, beforeImpersonate = false) {
    let token: string = headers.get('authorization');
    token = token.substr(token.indexOf(' ') + 1);
    localStorage.setItem('token', token);
    localStorage.setItem('showAchievement', 'true');
    if (beforeImpersonate) {
      localStorage.setItem('beforeImpersonatedToken', token);
    }
  }

  /**
   * @returns Is user logged in.
   */
  public isLoggedIn(): boolean {
    return !!this.id;
  }

 /**
  * Loading current user's data from server.
  * This is necessary for first load of head-page.
  *
  * @returns Current user, if exists
  */

  public load(): Observable<User> {
    return this.http.get(this.apiProfilePath, { observe: 'response' }).pipe(
      map((res: any) => {
        this._fromJSON(res.body.user);
        return this;
      })
    );
  }

  public updateFavoriteAchievement(userId: number, achievementId: string): Observable<UpdateFavoriteAchievement>  {
    return this.http.put(`${this.apiUsersPath}/${userId}/achievements/${achievementId}/set_favorite`, {}).pipe(
      map((res: UpdateFavoriteAchievement) =>  new UpdateFavoriteAchievement(res))
    );
  }

  public updateSettings(userData: User = this): Observable<User> {
    if (typeof userData.birthday !== 'undefined') {
      const bDay = new Date(userData.birthday);
      const bDayUTC = new Date(Date.UTC(bDay.getFullYear(),
                                        bDay.getMonth(),
                                        bDay.getDate()));
      userData.birthday = bDayUTC.toDateString();
    }
    const data = { user: userData._toJSON() };

    return this.http.put(this.apiProfilePath, data, { observe: 'response' }).pipe(
      map((res: any) => {
        this._fromJSON(res.body.user);
        return this;
      })
    );
  }

  public loadDocuments(token: string): Observable<InvitationRespone>  {
    return this.http.get(`${this.apiUsersPath}/${token}/invitation`).pipe(
      map(resp => new InvitationRespone(resp))
    );
  }

  public acceptInvite(token: string, user: InviteUser): Observable<boolean> {
    const params = { user: user._toJSON() };

    return this.http.put(`${this.apiUsersPath}/${token}/invitation`, params, { observe: 'response' }).pipe(
      map(resp => {
        CurrentUserService.setTokenByHeaders(resp.headers);
        return true;
      })
    );
  }

  public edit(): Observable<IUserEdit> {
    return this.http.get(`${this.apiProfilePath}/edit`).pipe(
      map((res: any) => {
        const timings = Model.newCollection(Timing, res.timings);
        return { timings };
      })
    );
  }

  public sendPasswordReset(email: string): Observable<boolean> {
    const data = { user: { email } };

    return this.http.post(`${this.apiUsersPath}/password`, data, { observe: 'response' }).pipe(
      map(_ => true)
    );
  }

  public setNewPassword(password: string, token: string): Observable<boolean> {
    const data = {
      user: {
        password,
        password_confirmation: password,
        reset_password_token: token
      }
    };

    return this.http.put(`${this.apiUsersPath}/password`, data, { observe: 'response' }).pipe(
      map(_ => true)
    );
  }

  public signIn(email: string, password: string): Observable<boolean> {
    const data = { user: { email, password } };

    return this.http.post(`${this.apiUsersPath}/sign_in`, data, { observe: 'response' }).pipe(
      map(resp => {
        this._fromJSON(resp.body);
        CurrentUserService.setTokenByHeaders(resp.headers, true);
        return true;
      })
    );
  }

  public impersonateUser(user: User): Observable<boolean> {
    return this.http.post(`${this.apiAdminUsersPath}/${user.id}/impersonate`, user.id, { observe: 'response' }).pipe(
      map(resp => {
        this._fromJSON(resp.body);
        localStorage.setItem('impersonatedMode', 'true');
        CurrentUserService.setTokenByHeaders(resp.headers);
        return true;
      })
    );
  }

  public stopImpersonateUser(): Observable<boolean> {
    return this.http.post(`${this.apiAdminUsersPath}/stop_impersonating`, this.id).pipe(
      map(() => {
        const token: string = localStorage.getItem('beforeImpersonatedToken');
        if (token) {
          localStorage.setItem('token', token);
          localStorage.removeItem('impersonatedMode');
        }
        return !!token;
      })
    );
  }

  public signOut(): Observable<boolean> {
    return this.http.delete(`${this.apiUsersPath}/sign_out`).pipe(
      map(_ => {
        localStorage.removeItem('token');
        localStorage.removeItem('beforeImpersonatedToken');
        localStorage.removeItem('impersonatedMode');
        return true;
      })
    );
  }

  public uploadAvatar(image: File): Observable<User> {
    const data = new FormData();
    data.append('avatar', image, image.name);

    const req = new HttpRequest(
      'PUT',
      `${this.apiProfilePath}/update_avatar`,
      data,
      { reportProgress: true }
    );

    return new Observable((observer: Observer<User>) => {
      this.avatarSubscription = this.http.request(req)
        .pipe(
          map((e: HttpEvent<any>) => {
            if (e.type === HttpEventType.UploadProgress) {
              const progress = e as HttpProgressEvent;
              this.progressSubject.next(
                Math.round(100 * progress.loaded / progress.total)
              );
            } else if (e.type === HttpEventType.Response) {
              return e.body;
            }
          }),
          last(null),
          catchError(error => error)
        )
        .subscribe(
          (res: any) => {
            this._fromJSON(res.user);
            observer.next(this);
            observer.complete();
          },
          error => observer.error(error)
        );
    });
  }

  public hasPermissions(permissions: string | string[]): boolean {
    if (this.email === OWNER) {
      return true;
    } else if (typeof permissions === 'string') {
      const [subject, action] = permissions.split(':');
      return !!this.permissions.find(p => p.subject === subject && p.action === action);
    } else if (Array.isArray(permissions)) {
      return permissions.every(permission => this.hasPermissions(permission));
    } else {
      return false;
    }
  }

  public hasSomePermissions(permissions: string | string[]): boolean {
    if (this.email === OWNER) {
      return true;
    } else if (typeof permissions === 'string') {
      const [subject, action] = permissions.split(':');
      return !!this.permissions.find(p => p.subject === subject && p.action === action);
    } else if (Array.isArray(permissions)) {
      return permissions.some(permission => this.hasSomePermissions(permission));
    } else {
      return false;
    }
  }
}
