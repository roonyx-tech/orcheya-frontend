import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CurrentUserService } from './current-user.service';
import { User } from '@models';

@Injectable()
export class IntegrationsService {
  private apiUrl = '/api/integration';

  constructor(
    private http: HttpClient,
    private user: CurrentUserService,
  ) {}

  private static redirectByUrl(url: string): void {
    window.location.href = url;
  }

  public slackConnect(): void {
    this.http.get(`${this.apiUrl}/slack`).subscribe(
      (resp: any) => IntegrationsService.redirectByUrl(resp.uri)
    );
  }

  public slackDisconnect(): Observable<User> {
    return this.http.get(`${this.apiUrl}/slack/disconnect`).pipe(
      map((res: any) => {
        this.user._fromJSON(res.user);
        return this.user;
      })
    );
  }

  public timeDoctorConnect(): void {
    this.http.get(`${this.apiUrl}/timedoctor`).subscribe(
      (resp: any) => IntegrationsService.redirectByUrl(resp.uri)
    );
  }

  public timeDoctorDisconnect(): Observable<User> {
    return this.http.get(`${this.apiUrl}/timedoctor/disconnect`).pipe(
      map((res: any) => {
        this.user._fromJSON(res.user);
        return this.user;
      })
    );
  }

  public discordConnect(): void {
    this.http.get(`${this.apiUrl}/discord`).subscribe(
      (resp: any) => IntegrationsService.redirectByUrl(resp.uri)
    );
  }

  public discordDisconnect(): Observable<User> {
    return this.http.get(`${this.apiUrl}/discord/disconnect`).pipe(
      map((res: any) => {
        this.user._fromJSON(res.user);
        return this.user;
      })
    );
  }
}
