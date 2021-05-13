import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Achievement } from '@models';

export interface AchievementCounters {
  title: string;
  value: string;
}

const ADMIN_ACHIEVEMENTS_URL = '/api/admin/achievements';

@Injectable({
  providedIn: 'root'
})
export class AchievementsService {

  constructor(private http: HttpClient) { }

  public getAchievements(): Observable<Achievement[]> {
    return this.http.get<Achievement[]>(`${ADMIN_ACHIEVEMENTS_URL}`).pipe(
      map((response: any) => Achievement.newCollection(Achievement, response.achievements))
    );
  }

  public addAchievement(achievement: Achievement): Observable<Achievement> {
    return this.http.post<Achievement>(`${ADMIN_ACHIEVEMENTS_URL}`, achievement._toJSON()).pipe(
      map((response: any) => Achievement.new(Achievement, response.achievement))
    );
  }

  public editAchievement(achievement: Achievement): Observable<Achievement> {
    return this.http.put<Achievement>(`${ADMIN_ACHIEVEMENTS_URL}/${achievement.id}`, achievement._toJSON()).pipe(
      map((response: any) => Achievement.new(Achievement, response.achievement))
    );
  }

  public deleteAchievement(achievement: Achievement): Observable<boolean> {
    return this.http.delete(`${ADMIN_ACHIEVEMENTS_URL}/${achievement.id}`).pipe(map(_ => true));
  }

  public getAchievement(achievement: Achievement): Observable<Achievement> {
    return this.http.get(`${ADMIN_ACHIEVEMENTS_URL}/${achievement.id}`, achievement._toJSON()).pipe(
      map(response => Achievement.new(Achievement, response))
    );
  }

  public getCounters(): Observable<AchievementCounters[]> {
    return this.http.get(`${ADMIN_ACHIEVEMENTS_URL}/counters`).pipe(
      map((response: string[]) => response.map(item => ({ title: item.split('_').join(' '), value: item })))
    );
  }
}
