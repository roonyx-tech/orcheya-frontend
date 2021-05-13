import { Model, Alias } from 'tsmodels';
import { DifficultyLevel } from './difficulty-level';
import { SkillType } from './skill-type';

export class Skill extends Model {
  @Alias() public id: number;
  @Alias() public title: string;
  @Alias('difficulty_level_id') public difficultyLevelId: number;
  @Alias('difficulty_level') public difficultyLevel: DifficultyLevel;
  @Alias('skill_type_id') public skillTypeId: number;
  @Alias('skill_type') public skillType: SkillType;
  @Alias() public variants: string;
  @Alias() public approved: boolean;

  constructor(skill?: any) {
    super();

    if (skill) {
      this._fromJSON(skill);
    }
  }
}
