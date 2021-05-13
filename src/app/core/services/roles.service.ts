import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Role } from '../models';

const API_PATH = '/api/roles';

@Injectable()
export class RolesService {
  constructor(private http: HttpClient) {}

  public getList(): Observable<Role[]> {
    return this.http.get(API_PATH).pipe(
      map((res: any) => Role.newCollection(Role, res))
    );
  }
}
