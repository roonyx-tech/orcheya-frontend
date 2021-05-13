import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PermissionSubject } from '@models';
import { map } from 'rxjs/operators';

const API_PERMISSION_URL = '/api/permissions';

@Injectable()
export class PermissionsService {

  constructor(private http: HttpClient) { }

  public getPermissionSubjects(): Observable<PermissionSubject[]> {
    return this.http.get<PermissionSubject[]>(API_PERMISSION_URL).pipe(
      map(response => PermissionSubject.newCollection(PermissionSubject, response))
    );
  }
}
