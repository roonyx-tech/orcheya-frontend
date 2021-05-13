import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Skill, SkillUpdate, UserSkill } from '@models';

const API_PATH = '/api/skills';

@Injectable()
export class SkillsService {
  public allSkills: Array<Skill>;
  public userSkills: Array<UserSkill>;

  constructor(private http: HttpClient) { }

  public getSkillsByName(tags: string[]): Observable<Skill[]> {
    return this.http.post(`${API_PATH}/search`, { tags })
      .pipe(
        map((data: any) => {
          if (!data.skills.length) {
            return new Array();
          } else {
            return Skill.newCollection(Skill, data.skills);
          }
        })
      );
  }

  public getHighestSkills(id: number = null): Observable<string> {
    return this.getUserSkills(id).pipe(
      map(data => {
        const highestSkills: Array<string> = [];
        data.filter(userSkill => userSkill.level)
          .slice(0, 5)
          .forEach(item => highestSkills.push(item.skill.title));
        return highestSkills.join(', ');
      })
    );
  }

  public getAllSkills(): Observable<Skill[]> {
    return this.http.get(API_PATH).pipe(
      map((data: any) => this.allSkills = Skill.newCollection(Skill, data.skills))
    );
  }

  public getUserSkills(id: number): Observable<UserSkill[]> {
    return this.http.get(`/api/users/${id}/skills`).pipe(
      map((data: any) => {
        this.userSkills =
          UserSkill.newCollection(UserSkill, data.users_skills);
        return this.userSkills;
      })
    );
  }

  public createOfferToAddSkill(skill: Skill): Observable<Skill> {
    return this.http.post(API_PATH, skill._toJSON()).pipe(
      map((data: Skill) => new Skill(data))
    );
  }

  public addUserSkillUpdate(
    update: object,
    id: number
  ): Observable<UserSkill[]> {
    return this.http.post(`/api/users/${id}/bulk_skill_updates`, update)
      .pipe(
        map((data: any) => {
          data.users_skills.forEach(skill => {
            const updated = new UserSkill(skill);
            const index =
              this.userSkills.findIndex(userSkill =>
                userSkill.skill.id === updated.skill.id
              );
            if (index !== -1) {
              this.userSkills[index] = updated;
            } else {
              this.userSkills.push(updated);
            }
          });
          return this.userSkills;
        })
      );
  }

  public updateSkill(
    userId: number,
    update: SkillUpdate
  ): Observable<UserSkill> {
    return this.http
      .put(
        `/api/users/${userId}/skill_updates/${update.id}`, update._toJSON()
      )
      .pipe(
        map((data: UserSkill) => new UserSkill(data))
      );
  }

  public deleteUserSkill(
    skillId: number,
    userId: number
  ): Observable<UserSkill[]> {
    return this.http.delete(`/api/users/${userId}/skills/${skillId}`).pipe(
      map((data: { 'status': number }) => {
        if (data.status === 204) {
          this.userSkills =
            this.userSkills.filter(skill => skill.id !== skillId);
        }
        return this.userSkills;
      })
    );
  }

  public filterTips(searchString: string, tips: Array<string>): Array<string> {
    if (searchString.length > 0) {
      const curFilter = searchString.split(',').slice(-1).pop().trim();
      let filters = [];
      if (searchString.includes(',')) {
        filters = searchString
          .substring(0, searchString.lastIndexOf(','))
          .split(',')
          .map(item => item.trim())
          .filter(item => item);
      }
      return tips
        .filter(
          title => filters.indexOf(title.toLowerCase()) === -1
            && title.toLowerCase().includes(curFilter.toLowerCase())
        );
    }
    return tips;
  }
}
