import { Model, Alias } from 'tsmodels';

export class SkillType extends Model {
  @Alias() public id: number;
  @Alias() public title: string;

  constructor(skillType?: any) {
    super();

    if (skillType) {
      this._fromJSON(skillType);
    }
  }
}
