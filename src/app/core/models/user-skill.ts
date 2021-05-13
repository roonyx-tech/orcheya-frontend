import { Model, Alias } from 'tsmodels';
import { Skill } from './skill';
import { SkillUpdate } from './skill_update';

export class UserSkill extends Model {
  @Alias() public id: number;
  @Alias() public level: number;
  @Alias('skill_id') public skillId: number;
  @Alias('skill', Skill) public skill: Skill;
  @Alias('skill_last_update', SkillUpdate) public skillUpdate: SkillUpdate[];

  constructor(userSkill?: UserSkill) {
    super();

    if (userSkill) {
      this._fromJSON(userSkill);
    }
  }
}
