import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  User,
  TimeActivity,
  Meta,
  UserFilter,
  TimeGraphFilter,
  AchievementUser
} from '@models';
import { FilterHttpHelper } from '@shared-helpers';

export interface UsersListResponse {
  users: Array<User>;
  meta: Meta;
}

export interface UserListAchievement {
  users_achievements: Array<AchievementUser>;
}

@Injectable()
export class UsersListService {
  private apiPath = '/api/users';

  constructor(private http: HttpClient) {}

  public getUsersList(filter?: UserFilter): Observable<UsersListResponse> {
    const query = FilterHttpHelper.getQueryStrByFilter(filter);

    return this.http.get(`${this.apiPath}${query}`).pipe(
      map( (data: UsersListResponse) => {
        data.users = data.users.map(
          user => new User(user)
        );

        return data;
      })
    );
  }

  public getIntegrationTime(filter: TimeGraphFilter): Observable<Array<TimeActivity>> {
    const query = FilterHttpHelper.getQueryStrByFilter(filter);
    return this.http.get(`${this.apiPath}/${filter.id}/timegraph${query}`).pipe(
      map((data: Array<TimeActivity>) => data)
    );
  }

  public getUserAchievementsById(id: number): Observable<Array<AchievementUser>> {
    return this.http.get<UserListAchievement>(`${this.apiPath}/${id}/achievements`).pipe(
      map((data: UserListAchievement) =>
        AchievementUser.newCollection(
          AchievementUser, data.users_achievements.sort(achievement => achievement.kind === 'auto' ?  1 : -1)
        )
      )
    );
  }

  public getUserTimeStatsById(id: number) {
    return this.http.get(`${this.apiPath}/${id}/stats`);
  }

  public getUserById(id: number): Observable<User> {
    return this.http.get(`${this.apiPath}/${id}`).pipe(
      map(
        (res: { user: User }) => {
          const user = new User(res.user);
          return user;
        }
      )
    );
  }

  public search(tags: Array<string>): Observable<Array<User>> {
    return this.http.post(`${this.apiPath}/search`, { tags })
      .pipe(
        map((data: any) => {
          if (data === 204) {
            return new Array();
          }
          return User.newCollection(User, data.users);
        })
      );
  }

  public updateUserEnglishLevel(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiPath}/${user.id}`, user._toJSON())
      .pipe(map((data: any) => new User(data.user)));
  }
}
