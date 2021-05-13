import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  IUsersIndex,
  IUserEdit,
  User,
  Role,
  Timing,
} from '@models';
import { map } from 'rxjs/operators';

const ADMIN_USERS_URL = '/api/admin/users';

@Injectable()
export class UsersService {
  constructor(private http: HttpClient) {}

  public getUsersList(): Observable<IUsersIndex> {
    return this.http.get(ADMIN_USERS_URL).pipe(
      map((resp: any) => {
        const users = User.newCollection(User, resp.users || []);
        const roles = Role.newCollection(Role, resp.meta.roles);
        const invitedUsers = User.newCollection(User, resp.invited_users);
        const deletedUsers = User.newCollection(User, resp.deleted_users);
        return { users, roles, deletedUsers, invitedUsers};
      })
    );
  }

  public edit(userId: number): Observable<IUserEdit> {
    return this.http.get(`${ADMIN_USERS_URL}/${userId}/edit`).pipe(
      map((resp: any) => {
        const user = User.new(User, resp.user);
        const roles = Role.newCollection(Role, resp.meta.roles);
        const timings = Timing.newCollection(Timing, resp.meta.timings);
        return { user, roles, timings };
      })
    );
  }

  public update(user: User): Observable<User> {
    return this.http.put(`${ADMIN_USERS_URL}/${user.id}`, { user: user._toJSON() }).pipe(
      map((resp: any) => User.new(User, resp.user))
    );
  }

  public removeUser(user: User): Observable<boolean> {
    return this.http.delete(`${ADMIN_USERS_URL}/${user.id}`).pipe(map(_ => true));
  }

  public restoreUser(user: User): Observable<boolean> {
    return this.http.get(`${ADMIN_USERS_URL}/${user.id}/restore`).pipe(map(_ => true));
  }

}
