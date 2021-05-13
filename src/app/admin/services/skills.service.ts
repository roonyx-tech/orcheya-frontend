import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Skill, SkillType } from '@models';

const API_PATH = '/api/admin/skills';
const SKILL_TYPES_PATH = '/api/admin/skill_types';

@Injectable()
export class SkillsService {
  constructor(private http: HttpClient) { }

  public getAllSkills(): Observable<Skill[]> {
    return this.http.get(API_PATH).pipe(
      map((data: any) => Skill.newCollection(Skill, data.skills))
    );
  }

  public createSkill(skill: Skill): Observable<Skill> {
    return this.http.post(API_PATH, skill._toJSON()).pipe(
      map((data: any) => new Skill(data.skill))
    );
  }

  public updateSkill(skill: Skill): Observable<Skill> {
    return this.http.put(`${API_PATH}/${skill.id}`, skill._toJSON())
      .pipe(
        map((data: any) => new Skill(data.skill))
      );
  }

  public deleteSkill(id: number): Observable<boolean> {
    return this.http.delete(`${API_PATH}/${id}`).pipe(map(() => true));
  }

  public getSkillTypes(): Observable<SkillType[]> {
    return this.http.get(SKILL_TYPES_PATH).pipe(
      map((data: any) => SkillType.newCollection(SkillType, data))
    );
  }

  public addSkillType(skillType: SkillType): Observable<SkillType> {
    return this.http.post(SKILL_TYPES_PATH, skillType._toJSON()).pipe(
      map((data: any) => new SkillType(data))
    );
  }

  public editSkillType(skillType: SkillType): Observable<SkillType> {
    return this.http.put(`${SKILL_TYPES_PATH}/${skillType.id}`, skillType._toJSON()).pipe(
      map((data: any) => new Skill(data))
    );
  }

  public deleteSkillType(skillType: SkillType, newSkillType: SkillType): Observable<boolean> {
    const httpParams = new HttpParams()
      .set('new_skill_type', newSkillType.id.toString());
    return this.http.delete<SkillType>(`${SKILL_TYPES_PATH}/${skillType.id}`, { params: httpParams })
      .pipe(map(() => true));
  }

}
