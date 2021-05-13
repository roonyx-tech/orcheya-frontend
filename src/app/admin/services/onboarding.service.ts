import { Injectable } from '@angular/core';
import { Document, FormedIntegration, Invite, User } from '@models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';

const ADMIN_INVITE_URL = '/api/admin/invitations/';
const ADMIN_DOCUMENT = '/api/admin/steps/';

interface UserInvited {
  user: Invite;
}

interface InviteUrl {
  invitation_url: string;
}

interface AddDocument {
  step: Document;
}

@Injectable()
export class OnboardingService {

  constructor(private http: HttpClient) { }

  public userInvite(id: string): Observable<Invite> {
    return this.http.get<UserInvited>(ADMIN_INVITE_URL + id).pipe(
      map((response: UserInvited) => Invite.new(Invite, response.user)));
  }

  public getSteps(params?: number): Observable<Array<Document>> {
    if (params) {
      const httpParams = new HttpParams().set('role_id', params.toString());
      return this.http.get<Array<Document>>(ADMIN_DOCUMENT, { params: httpParams });
    } else {
      return this.http.get<Array<Document>>(ADMIN_DOCUMENT);
    }
  }

  public getStepsIntegration(): Observable<Array<FormedIntegration>> {
    return this.http.get<Array<string>>(`${ADMIN_DOCUMENT}integrations`).pipe(
      map(integrations => integrations.map(integration => {
        return { name: integration, disabled: false };
      }))
    );
  }

  public invite(invite: Invite, inviteId?: string): Observable<string> {
    if (inviteId) {
      return this.http.put(ADMIN_INVITE_URL + inviteId, { user: invite._toJSON() }).pipe(
        map((res: UserInvited) => Invite.new(Invite, res.user).invite));
    } else {
      return this.http.post(ADMIN_INVITE_URL, { user: invite._toJSON() }).pipe(
        map((res: InviteUrl) => res.invitation_url));
    }
  }

  public removeUserInvited(user: User): Observable<boolean> {
    return this.http.delete(`${ADMIN_INVITE_URL}/${user.id}`).pipe(map(_ => true));
  }
}
