import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '@models';
import { map } from 'rxjs/operators';

const ROLES_URL = '/api/roles';

@Injectable()
export class RolesService {
  constructor(private http: HttpClient) {}

  public getRolesList(params?: any): Observable<Role[]> {
    return this.http.get(ROLES_URL, { params }).pipe(
      map((response: any) => Role.newCollection(Role, response))
    );
  }

  public createRole(role: Role): Observable<Role> {
    return this.http.post<Role>(`${ROLES_URL}`, { role }).pipe(
      map(response => Role.new(Role, response))
    );
  }

  public removeRole(role: Role, newRole: Role): Observable<boolean> {
    let httpParams;
    if (newRole) {
      httpParams = new HttpParams()
      .set('new_role', newRole.id.toString());
    }
    return this.http.delete(`${ROLES_URL}/${role.id}`, {params: httpParams}).pipe(
      map(_ => true)
    );
  }

  public updateRole(role: Role): Observable<Role> {
    return this.http.put(`${ROLES_URL}/${role.id}`, { role }).pipe(
      map(response => Role.new(Role, response))
    );
  }

  public getRole(role: Role): Observable<Role> {
    return this.http.get(`${ROLES_URL}/${role.id}`, role._toJSON()).pipe(
      map(response => Role.new(Role, response))
    );
  }
}
